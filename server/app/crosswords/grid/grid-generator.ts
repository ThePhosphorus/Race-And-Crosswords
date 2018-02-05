import { Word, CrosswordGrid, Letter, Difficulty, Orientation, MIN_WORD_LENGTH } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

const BT_SWITCH_FACTOR: number = 3;
const MAX_ROLLBACKS: number = 100;
const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-word";

export class GridGenerator {

    private crossword: CrosswordGrid;
    private notPlacedWords: Word[];
    private rollbackCount: number = 0;

    public async getNewGrid(difficulty: Difficulty, size: number, blackTileRatio: number): Promise<CrosswordGrid> {
        this.crossword = new CrosswordGrid();
        this.initializeGrid(size);
        this.generateBlackTiles(blackTileRatio);
        this.initializeWords();
        this.sortWords();
        await this.findWords(difficulty);
        this.cleanGrid();
        this.displayGrid();

        return this.crossword;
     }

    private initializeGrid(size: number): void {
        this.crossword.size = size;
        this.crossword.grid = new Array<Letter>(size * size);
        for (let i: number = 0; i < size * size; i++) {
            this.crossword.grid[i] = new Letter("");
        }
     }

    private generateBlackTiles(blackTileRatio: number): void {
        const maxBlackTile: number = this.crossword.size * this.crossword.size * blackTileRatio;
        let generatedBlackTiles: number = this.generateBasicBlackTiles();
        while (generatedBlackTiles < maxBlackTile) {
            const id: number = Math.floor(Math.random() * (this.crossword.size * this.crossword.size));
            if (id > this.crossword.size && id % this.crossword.size !== 0 && !this.crossword.grid[id].isBlackTile) {
                this.crossword.grid[id].isBlackTile = true;
                generatedBlackTiles++;
            }
        }

     }
    private generateBasicBlackTiles(): number {
        let blackTileCount: number = 0;
        for (let i: number = 1; i < this.crossword.size ; i += BT_SWITCH_FACTOR) {
            for (let j: number = 1; j < this.crossword.size ; j += BT_SWITCH_FACTOR) {
                const id: number = j + (this.crossword.size * i);
                this.crossword.grid[id].isBlackTile = true;
                blackTileCount++;
            }
        }

        return blackTileCount;
     }
    private initializeWords(): void {
        this.notPlacedWords = new Array<Word>();
        let acrossWord: Word = new Word();
        let downWord: Word = new Word();
        for (let i: number = 0; i < this.crossword.size; i++) {
            for (let j: number = 0; j < this.crossword.size; j++) {
                // ACROSS
                if (!this.crossword.grid[(this.crossword.size * i) + j].isBlackTile) {
                    acrossWord.letters.push(this.crossword.grid[(this.crossword.size * i) + j]);
                } else { // IF BLACK TILE
                    this.addWord(acrossWord, Orientation.Across);
                    acrossWord = new Word();
                }
                // DOWN
                if (!this.crossword.grid[(this.crossword.size * j) + i].isBlackTile) {
                    downWord.letters.push(this.crossword.grid[(this.crossword.size * j) + i]);
                } else {
                    this.addWord(downWord, Orientation.Down);
                    downWord = new Word();
                }
            }
            this.addWord(acrossWord, Orientation.Across);
            this.addWord(downWord, Orientation.Down);
            acrossWord = new Word();
            downWord = new Word();
        }
     }

    private getWordWeight(word: Word): number {
        let weight: number = 0;
        for (const letter of word.letters) {
            weight += letter.count;
        }

        return weight;
    }
    private sortWords(): void {
         this.notPlacedWords = this.notPlacedWords.sort((w1: Word, w2: Word) => this.getWordWeight(w1) - this.getWordWeight(w2));
     }

    private addWord(word: Word, orientation: Orientation): void {
        if (word.letters.length >= MIN_WORD_LENGTH) {
            word.orientation = orientation;
            this.notPlacedWords.push(word);
        }
     }

    private async findWords(difficulty: Difficulty): Promise<void> {

        while (this.notPlacedWords.length > 0) {
            if (this.rollbackCount > MAX_ROLLBACKS) {
               this.nukeGrid();
               this.rollbackCount = 0;
            }
            this.sortWords();

            await this.findWord(this.notPlacedWords.pop(), difficulty);
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
             if (receivedWord !== undefined) {
                 this.setWord(receivedWord, word, difficulty);
                 this.crossword.words.push(word);
                 this.displayGrid();
             } else {
                 this.backjump(word);
                 this.rollbackCount++;

                 }
             }
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

        let isProblemWord: boolean = false;
        while (!isProblemWord && this.crossword.words.length) {
            const backtrackWord: Word = this.crossword.words.pop();
            // console.log(backtrackWord);
            this.notPlacedWords.push(backtrackWord);
            for (const newLetter  of backtrackWord.letters) {
                for (const currentLetter  of currentWord.letters) {
                    if (currentLetter.char !== "" && newLetter === currentLetter) {
                        isProblemWord = true;
                    }
                }
            }
            this.unsetWord(backtrackWord);
        }
    }

     /*
    private rollback(currentIndex: number): number {
        let newIndex: number = Math.floor(currentIndex / ROLLBACK_AMOUNT);
        if (newIndex < 0) { newIndex = 0; }

        for (let index: number = currentIndex - 1; index >= newIndex ; index--) {
            this.unsetWord(this.crossword.words[index]);

        }

        return newIndex ;
     }
     */
    private getConstraints(word: Word): string {
        let constraint: string = "";
        word.letters.forEach((letter: Letter) => {
            constraint += letter.char === "" ? "?" : letter.char;
        });

        return constraint;
     }

    private nukeGrid(): void {
        let blackTileCount: number = 0;
        this.crossword.grid.forEach((letter: Letter) => {
            letter.char = "";
            letter.count = 0;
            if (letter.isBlackTile) {
                blackTileCount++;
                letter.isBlackTile = false ;
            }
        });
        this.generateBlackTiles(blackTileCount / (this.crossword.size * this.crossword.size));
        this.crossword.words = new Array<Word>();
        this.initializeWords();
        this.sortWords();
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

    private displayGrid(): void {
        let s: string = "";
        for (let i: number = 0; i < this.crossword.size ; i++) {
            for (let j: number = 0; j < this.crossword.size; j++) {
                const l: Letter = this.crossword.grid[(this.crossword.size * i) + j];
                s += l.char !== "" ? l.char : (l.isBlackTile ? "#" : "-");
            }
            s += "\n";
        }
        console.log(s);
     }

}
