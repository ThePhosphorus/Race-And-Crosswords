import { Word, CrosswordGrid, Letter, Difficulty} from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";
import { EmptyGridFactory } from "./emptyGridFactory/empty-grid-factory";
import { ExtendedCrosswordGrid } from "./extendedCrosswordGrid/extended-crossword-grid";

const MAX_TOTAL_ROLLBACKS: number = 30 ;
const MAX_WORD_ROLLBACKS: number = 2;
const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-word";

export class GridGenerator {

    private emptyGridFactory: EmptyGridFactory;
    private crossword: ExtendedCrosswordGrid;
    private notPlacedWords: Word[];
    private rollbackCount: number = 0;

    public async getNewGrid(difficulty: Difficulty, size: number, blackTileRatio: number): Promise<CrosswordGrid> {
        this.emptyGridFactory = new EmptyGridFactory(size, blackTileRatio);
        this.initialiseEmptyGrid();
        await this.findWords(difficulty);
        this.cleanGrid();

        return this.crossword;
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
                this.initialiseEmptyGrid();
                this.rollbackCount = 0;
            }

            await this.findWord(this.notPlacedWords.pop(), difficulty);
            this.sortWords();
        }

    }

    private async findWord(word: Word, difficulty: Difficulty): Promise<void> {
        const constraint: string = this.getConstraints(word);
        if (constraint.indexOf("?") === -1) {
            this.backjump(word);
            this.rollbackCount++;

        } else {
            const isEasyWord: boolean = difficulty !== Difficulty.Hard;
            const receivedWord: DatamuseWord = await this.getWordsFromServer(constraint, word, isEasyWord);
            if (receivedWord !== undefined && this.isUnique(receivedWord)) {
                this.setWord(receivedWord, word, difficulty);
                this.crossword.words.push(word);
                this.displayGrid();
            } else {
                this.backjump(word);
                this.rollbackCount++;

            }
        }
    }

    private displayGrid(): void {
        // Used for debugging puposes
        let s: string = "";
        for (let i: number = 0; i < this.crossword.size; i++) {
            for (let j: number = 0; j < this.crossword.size; j++) {
                const l: Letter = this.crossword.grid[(this.crossword.size * i) + j];
                s += l.char !== "" ? l.char : (l.isBlackTile ? "#" : "-");
            }
            s += "\n";
        }
        console.log(s);

    }

    private isUnique(word: DatamuseWord): boolean {
        let isUnique: boolean = true;
        this.crossword.words.forEach((w: Word) => {
            isUnique = isUnique && w.letters.map((l: Letter) => l.char).reduce((acc: string, val: string) => acc += val) !== word.word;
        });

        return isUnique;
    }

    private async getWordsFromServer(constraint: string, word: Word, isEasyWord: boolean): Promise<DatamuseWord> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: constraint,
                easy: isEasyWord
            },
            json: true
        };

        return await Request(LEXICAL_SERVICE_URL, options) as DatamuseWord;
    }

    private setWord(receivedWord: DatamuseWord, gridWord: Word, difficulty: Difficulty): void {
        for (let i: number = 0; i < gridWord.letters.length; i++) {
            gridWord.letters[i].char = (gridWord.letters[i].char === "") ? receivedWord.word[i] : gridWord.letters[i].char;
            gridWord.letters[i].count++;
        }
        if (receivedWord.defs.length === 1 || difficulty === Difficulty.Easy) {
            gridWord.definitions.push(receivedWord.defs[0]);
        } else {
            gridWord.definitions.push(receivedWord.defs[1]);
        }
    }

    private unsetWord(word: Word): void {
        for (const letter of word.letters) {
            if ((--letter.count) <= 0) {
                letter.char = "";
            }
        }
    }
    private backjump(currentWord: Word): void {
       this.notPlacedWords.push(currentWord);
       let isProblemWord: boolean = false;
       while (!isProblemWord && this.crossword.words.length > 0) {
            const backtrackWord: Word = this.crossword.words.pop();
            this.notPlacedWords.push(backtrackWord);
            for (const newLetter of backtrackWord.letters) {
                for (const currentLetter of currentWord.letters) {
                    if (currentLetter.char !== "" && newLetter.id === currentLetter.id) {
                        isProblemWord = true;
                    }
                }
            }
            this.unsetWord(backtrackWord);
        }
       if ( ++currentWord.rollbackCount > MAX_WORD_ROLLBACKS) {
            currentWord.rollbackCount = 0;
            this.backjump(currentWord);
       }
    }

    private getConstraints(word: Word): string {
        let constraint: string = "";
        word.letters.forEach((letter: Letter) => {
            constraint += letter.char === "" ? "?" : letter.char;
        });

        return constraint;
    }

    private initialiseEmptyGrid(): void {

        this.crossword = this.emptyGridFactory.getNewGrid();
        this.crossword.words = new Array<Word>();
        this.notPlacedWords = this.crossword.findWords();
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
