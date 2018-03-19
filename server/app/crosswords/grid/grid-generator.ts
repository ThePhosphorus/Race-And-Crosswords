import { DatamuseWord } from "../../../../common/communication/datamuse-word";
import { EmptyGridGenerator } from "./emptyGridGenerator/empty-grid-generator";
import { ExtendedCrosswordGrid } from "./extendedCrosswordGrid/extended-crossword-grid";
import { ExternalCommunications } from "./ExternalCommunications/external-communications";
import {Word} from "../../../../common/crossword/word"
import {CrosswordGrid} from "../../../../common/crossword/crossword-grid"
import { Difficulty, Orientation } from "../../../../common/crossword/enums-constants";
import { Letter } from "../../../../common/crossword/letter";

const MAX_TOTAL_ROLLBACKS: number = 30;
const CONSTRAINT_CHAR: string = "?";

export class GridGenerator {

    private externalCommunications: ExternalCommunications;
    private emptyGridFactory: EmptyGridGenerator;
    private crossword: ExtendedCrosswordGrid;
    private notPlacedWords: Word[];
    private rollbackCount: number = 0;

    public constructor() {
        this.externalCommunications = new ExternalCommunications();
    }
    public async getNewGrid(difficulty: Difficulty, size: number): Promise<CrosswordGrid> {
        this.emptyGridFactory = new EmptyGridGenerator();
        this.initialiseEmptyGrid(size);
        await this.findWords(difficulty);
        this.cleanGrid();

        return this.crossword;
    }

    private initialiseEmptyGrid(size: number): void {

        this.crossword = this.emptyGridFactory.getNewGrid();
        this.crossword.words = new Array<Word>();
        this.notPlacedWords = this.crossword.findWords();
    }

    private getWordWeight(word: Word): number {
        let weight: number = 0;
        for (const letter of word.letters) {
            weight += letter.count;
        }

        return weight;
    }
    private sortWords(): void {
        this.notPlacedWords = this.notPlacedWords.sort((w1: Word, w2: Word) => {
            const difference: number = this.getWordWeight(w1) - this.getWordWeight(w2);
            if (difference !== 0) {
                return difference;
            } else {
                return w1.letters.length - w2.letters.length;
            }
        });
    }

    private async findWords(difficulty: Difficulty): Promise<void> {

        await this.findWord(this.notPlacedWords.pop(), difficulty);

        while (this.notPlacedWords.length > 0) {
            if (this.rollbackCount > MAX_TOTAL_ROLLBACKS) {
                this.initialiseEmptyGrid(this.crossword.size);
                this.rollbackCount = 0;
            }
            const word: Word = this.notPlacedWords.pop();
            if (! await this.findWord(word, difficulty)) {
                await this.backtrack(word, difficulty);
            }
            this.sortWords();
        }

    }

    private async findWord(word: Word, difficulty: Difficulty): Promise<boolean> {
        const constraint: string = this.getConstraints(word);
        if (constraint.indexOf(CONSTRAINT_CHAR) === -1) {
            const receivedWord: DatamuseWord = await this.externalCommunications.getDefinitionsFromServer(word.toString());

            return this.addWord(receivedWord, word, difficulty);

        } else {
            const isEasyWord: boolean = difficulty !== Difficulty.Hard;
            const receivedWord: DatamuseWord = await this.externalCommunications.getWordsFromServer(constraint, word, isEasyWord);

            return this.addWord(receivedWord, word, difficulty);
        }
    }

    private async addWord(receivedWord: DatamuseWord, word: Word, difficulty: Difficulty): Promise<boolean> {
        if (receivedWord != null && this.isUnique(receivedWord) && receivedWord.defs != null) {
            this.setWord(receivedWord, word, difficulty);
            this.setDefinition(receivedWord, word, difficulty);

            return true;
        }

        return false;

    }

    private isUnique(word: DatamuseWord): boolean {
        for (const w of this.crossword.words) {
            if (w.toString() === word.word) {
                return false;
            }
        }

        return true;
    }

    private setWord(receivedWord: DatamuseWord, gridWord: Word, difficulty: Difficulty): void {
        for (let i: number = 0; i < gridWord.letters.length; i++) {
            gridWord.letters[i].char = (gridWord.letters[i].char === "") ? receivedWord.word[i] : gridWord.letters[i].char;
            gridWord.letters[i].count++;
        }

        this.crossword.words.push(gridWord);
    }

    private setDefinition(receivedWord: DatamuseWord, gridWord: Word, difficulty: Difficulty): void {
        if (receivedWord.defs.length === 1 || difficulty === Difficulty.Easy) {
            gridWord.definitions.push(receivedWord.defs[0]);
        } else {
            gridWord.definitions.push(receivedWord.defs[1]);
        }
    }

    private async backtrack(currentWord: Word, difficulty: Difficulty): Promise<void> {
        this.rollbackCount++;
        let isFixed: boolean = false;
        while (!isFixed) {
            const removedWord: Word = this.backjump(currentWord);
            if (removedWord === undefined) {
                await this.findWord(currentWord, difficulty);
                isFixed = true;
            } else {
                const removedWordString: string = removedWord.toString();
                if (!await this.findWord(removedWord, difficulty)) {
                    this.notPlacedWords.push(removedWord);
                } else {
                    if (removedWord.toString() !== removedWordString && await this.findWord(currentWord, difficulty)) {
                        isFixed = true;
                    } else {
                        this.unsetWord(this.crossword.words.indexOf(removedWord));
                        this.notPlacedWords.push(removedWord);
                    }
                }
            }
        }
    }
    private backjump(currentWord: Word): Word {

        for (let i: number = this.crossword.words.length - 1; i >= 0; i--) {
            if (this.doesIntersect(this.crossword.words[i], currentWord)) {
                return this.unsetWord(i);
            }
        }

        return undefined;

    }

    private unsetWord(index: number): Word {
        const word: Word = this.crossword.words[index];
        for (const letter of word.letters) {
            if ((--letter.count) <= 0) {
                letter.char = "";
            }
        }
        this.crossword.words.splice(index, 1);

        return word;

    }

    private doesIntersect(word1: Word, word2: Word): boolean {

        if (word1.orientation === word2.orientation) {
            return false;
        }

        const acrossWord: Word = word1.orientation === Orientation.Across ? word1 : word2;
        const downWord: Word = word1.orientation === Orientation.Down ? word1 : word2;

        const column: number = this.crossword.getColumn(downWord.id);
        const row: number = this.crossword.getRow(acrossWord.id);

        if (this.crossword.getColumn(acrossWord.letters[0].id) > column ||
            this.crossword.getColumn(acrossWord.letters[acrossWord.letters.length - 1].id) < column ||
            this.crossword.getRow(downWord.letters[0].id) > row ||
            this.crossword.getRow(downWord.letters[downWord.letters.length - 1].id) < row) {
            return false;
        }

        return true;
    }

    private getConstraints(word: Word): string {
        let constraint: string = "";
        word.letters.forEach((letter: Letter) => {
            constraint += (letter.char === "") ? CONSTRAINT_CHAR : letter.char;
        });

        return constraint;
    }

    private cleanGrid(): void {
        for (const tile of this.crossword.grid) {
            if (tile.char === "") {
                tile.isBlackTile = true;
            } else {
                tile.char = tile.char.normalize("NFD")[0];
            }
        }
    }
}
