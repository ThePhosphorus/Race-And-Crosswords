import { Word, CrosswordGrid, Letter, Difficulty } from "../../../../common/communication/crossword-grid";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";
import { EmptyGridFactory } from "./emptyGridFactory/empty-grid-factory";
import { ExtendedCrosswordGrid } from "./extendedCrosswordGrid/extended-crossword-grid";
import { ExternalCommunications } from "./ExternalCommunications/external-communications";

const MAX_TOTAL_ROLLBACKS: number = 50;

export class GridGenerator {

    private externalCommunications: ExternalCommunications;
    private emptyGridFactory: EmptyGridFactory;
    private crossword: ExtendedCrosswordGrid;
    private notPlacedWords: Word[];
    private rollbackCount: number = 0;

    public constructor() {
        this.externalCommunications = new ExternalCommunications();
    }
    public async getNewGrid(difficulty: Difficulty, size: number): Promise<CrosswordGrid> {
        this.emptyGridFactory = new EmptyGridFactory();
        this.initialiseEmptyGrid(size);
        await this.findWords(difficulty);
        this.cleanGrid();

        return this.crossword;
    }

    private initialiseEmptyGrid(size: number): void {

        this.crossword = this.emptyGridFactory.getNewGrid(size);
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

            await this.findWord(this.notPlacedWords.pop(), difficulty);
            this.sortWords();
        }

    }

    private async findWord(word: Word, difficulty: Difficulty): Promise<void> {
        const constraint: string = this.getConstraints(word);
        if (constraint.indexOf("?") === -1) {
            const receivedWord: DatamuseWord = await this.externalCommunications.getDefinitionsFromServer(word.toString());
            await this.addWord(receivedWord, word, difficulty);

        } else {
            const isEasyWord: boolean = difficulty !== Difficulty.Hard;
            const receivedWord: DatamuseWord = await this.externalCommunications.getWordsFromServer(constraint, word, isEasyWord);
            await this.addWord(receivedWord, word, difficulty);
        }
        /*
        if (!this.verifyConstraints(constraint, word)) {
            this.crossword.displayGrid();
            throw new Error(" Placed invalid word");
        }*/
    }

    private async addWord(receivedWord: DatamuseWord, word: Word, difficulty: Difficulty): Promise<void> {
        if (receivedWord != null && this.isUnique(receivedWord) && receivedWord.defs != null) {
            this.setWord(receivedWord, word, difficulty);
            this.crossword.displayGrid();
        } else {
            await this.backjump(word);
            this.rollbackCount++;
        }
    }/*
    private verifyConstraints(constraint: string, placedWord: Word): boolean {

        if (constraint.length !== placedWord.letters.length) {
            console.error("Placed a word with length of : " + constraint.length + " for a word of length : " + placedWord.letters.length);

            return false;
        }
        for (let i: number = 0; i < constraint.length; i++) {
            if (constraint[i] !== "?" && constraint[i] !== placedWord.letters[i].char) {
                console.error("Placed a word  : " + placedWord.toString() + " for constraints: " + constraint);

                return false;
            }
        }

        return true;
    }*/
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
        if (receivedWord.word !== gridWord.toString()) {
            console.error("Placed " + receivedWord.word + ", but have " + gridWord.toString());
        }
        if (receivedWord.defs.length === 1 || difficulty === Difficulty.Easy) {
            gridWord.definitions.push(receivedWord.defs[0]);
        } else {
            gridWord.definitions.push(receivedWord.defs[1]);
        }
        this.crossword.words.push(gridWord);
    }

    private unsetWord(word: Word): void {
        this.notPlacedWords.push(word);
        for (const letter of word.letters) {
            if ((--letter.count) <= 0) {
                letter.char = "";
            }
        }
    }
    private async backjump(currentWord: Word): Promise<void> {
        this.rollbackCount++;
        let isProblemword: boolean = false;
        for (let i: number = this.crossword.words.length - 1; i >= 0; i--) {
            if (this.crossword.words[i].orientation !== currentWord.orientation) {
                this.crossword.words[i].letters.forEach((letter: Letter) => {
                    currentWord.letters.forEach((currentWordLetter: Letter) => {
                        if (currentWordLetter.char !== "" && currentWordLetter.id === letter.id) {
                            isProblemword = true;

                            return;
                        }
                    });
                    if (isProblemword) {
                        return;
                    }
                });
                if (isProblemword) {
                    this.unsetWord(this.crossword.words[i]);
                    this.crossword.words.splice(i, 1); // Add it to unset Word
                    await this.findWord(currentWord, Difficulty.Easy);
                    break;
                }
            }
        }
    }

    private getConstraints(word: Word): string {
        let constraint: string = "";
        word.letters.forEach((letter: Letter) => {
            constraint += (letter.char === "") ? "?" : letter.char;
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
