import { Word, CrosswordGrid, Letter, Difficulty } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";
import { EmptyGridFactory } from "./emptyGridFactory/empty-grid-factory";
import { ExtendedCrosswordGrid } from "./extendedCrosswordGrid/extended-crossword-grid";

const MAX_TOTAL_ROLLBACKS: number = 10;
const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical";
const LEXICAL_REQUEST_WORDS: string = "/query-word";
const LEXICAL_TEST_WORD: string = "/test-word";

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
            if (! await this.testWordFromServer(this.getStringFromWord(word))) {
                await this.backjump(word);
                this.rollbackCount++;

                return ;
            }

        }
        const isEasyWord: boolean = difficulty !== Difficulty.Hard;
        const receivedWord: DatamuseWord = await this.getWordsFromServer(constraint, word, isEasyWord);
        if (receivedWord !== undefined && this.isUnique(receivedWord)) {
            this.setWord(receivedWord, word, difficulty);
            this.crossword.words.push(word);
            console.log(" Constraints : " + constraint); // TODO  : Remove
            this.displayGrid();
        } else {
            await this.backjump(word);
            this.rollbackCount++;

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

    private getStringFromWord(word: Word): string {
        let wordString: string = "";
        word.letters.forEach((letter: Letter) => {
            wordString += letter.char;
        });

        return wordString;
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

        return await Request(LEXICAL_SERVICE_URL + LEXICAL_REQUEST_WORDS, options) as DatamuseWord;
    }

    private async testWordFromServer(word: string): Promise<boolean> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                word: word
            },
            json: true
        };

        return await Request(LEXICAL_SERVICE_URL + LEXICAL_TEST_WORD, options) as boolean;
    }

    private setWord(receivedWord: DatamuseWord, gridWord: Word, difficulty: Difficulty): void {
        for (let i: number = 0; i < gridWord.letters.length; i++) {
            gridWord.letters[i].char = (gridWord.letters[i].char === "") ? receivedWord.word[i] : gridWord.letters[i].char;
            if (gridWord.letters[i].char !== receivedWord.word[i]) {
                throw new Error("Expected : " + gridWord.letters[i].char + "  Got : " + receivedWord.word[i]);
            }
            gridWord.letters[i].count++;
        }
        if (receivedWord.defs.length === 1 || difficulty === Difficulty.Easy) {
            gridWord.definitions.push(receivedWord.defs[0]);
        } else {
            gridWord.definitions.push(receivedWord.defs[1]);
        }
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
                            console.log(currentWordLetter.id + " : " + currentWordLetter.char); // TODO: Remove
                            return;
                        }
                    });
                    if (isProblemword) {
                        return;
                    }
                });
                if (isProblemword) {
                    this.unsetWord(this.crossword.words[i]);
                    this.crossword.words.splice(i, 1); // TODO: Add it to unset Word
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
