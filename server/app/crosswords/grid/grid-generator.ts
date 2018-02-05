import { Word, CrosswordGrid, Letter, Difficulty, Orientation, MIN_WORD_LENGTH } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

const BT_SWITCH_FACTOR: number = 3;
const ROLLBACK_AMOUNT: number = 2;
const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-word";

export class GridGenerator {

    private crossword: CrosswordGrid;

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

    private sortWords(): void {
         this.crossword.words = this.crossword.words.sort((w1: Word, w2: Word) => w2.letters.length - w1.letters.length);
     }

    private addWord(word: Word, orientation: Orientation): void {
        if (word.letters.length >= MIN_WORD_LENGTH) {
            word.orientation = orientation;
            this.crossword.words.push(word);
        }
     }

    private async findWords(difficulty: Difficulty): Promise<void> {
        let currentIndex: number = 0;
        let rollbackCount: number = 0;
        while (currentIndex < this.crossword.words.length && currentIndex >= 0 ) {

            if (rollbackCount > ( this.crossword.size)) {
                this.nukeGrid();
                currentIndex = 0;
                rollbackCount = 0;
            }
            const word: Word = this.crossword.words[currentIndex];
            const constraint: string = this.getConstraints(word);
            if (constraint.indexOf("?") === -1) {
               currentIndex = this.backjump(currentIndex);
               rollbackCount++;

            } else {
                const receivedWord: DatamuseWord = await this.getWordsFromServer(constraint, word);
                if (receivedWord !== undefined) {
                    this.setWord(receivedWord, word);
                    currentIndex++;
                    this.displayGrid();
                } else {
                    currentIndex = this.backjump(currentIndex);
                    rollbackCount++;

                    }
                }
            }
        }

    private async getWordsFromServer(constraint: string, word: Word): Promise<DatamuseWord> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: constraint,
                easy: false
            },
            json: true
        };

        return await Request(LEXICAL_SERVICE_URL, options) as DatamuseWord;
     }

    private setWord(receivedWord: DatamuseWord, gridWord: Word): void {
        for (let i: number = 0; i < gridWord.letters.length; i++) {
            gridWord.letters[i].char = (gridWord.letters[i].char === "") ? receivedWord.word[i] : gridWord.letters[i].char;
            gridWord.letters[i].count++;
        }
        gridWord.definitions = receivedWord.defs;
     }

    private unsetWord(word: Word): void {
        for (const letter of word.letters) {
            if ((--letter.count) <= 0) {
                letter.char = "";
            }
        }
     }

    private backjump(currentIndex: number): number {

        let isProblemWord: boolean = false;
        let newIndex: number = currentIndex;
        while (!isProblemWord) {
            newIndex--;
            for (const newLetter  of this.crossword.words[newIndex].letters) {
                for (const currentLetter  of this.crossword.words[currentIndex].letters) {
                    if (newLetter === currentLetter) {
                        isProblemWord = true;
                    }
                }
            }
            this.unsetWord(this.crossword.words[newIndex]);
        }

        return newIndex;
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
