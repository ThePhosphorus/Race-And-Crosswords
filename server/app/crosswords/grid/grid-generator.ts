import { Word, CrosswordGrid, Letter, Difficulty, Orientation } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-words";

export class GridGenerator {

    private crossword: CrosswordGrid;

    public async getNewGrid(difficulty: Difficulty, size: number, blackTileRatio: number): Promise<CrosswordGrid> {
        this.crossword = new CrosswordGrid();
        this.initializeGrid(size);
        this.generateBlackTiles(blackTileRatio);
        this.initializeWords();
        this.sortWords();
        await this.findWord(difficulty, 0);
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
        const numberOfBlackTile: number = this.crossword.size * this.crossword.size * blackTileRatio;
        const blackTiles: Set<number> = new Set<number>();
        while (blackTiles.size < numberOfBlackTile) {
            const id: number = Math.floor(Math.random() * (this.crossword.size * this.crossword.size));
            if (id > this.crossword.size && id % this.crossword.size !== 0) {
                blackTiles.add(id);
                this.crossword.grid[id].isBlackTile = true;
            }
        }
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
        if (word.letters.length > 1) {
            word.orientation = orientation;
            this.crossword.words.push(word);
        }
    }
    /*
    private async findWords(difficulty: Difficulty): Promise<void> {
        for (const word of this.crossword.words) {
            const receivedWord: DatamuseWord = await this.getWordsFromServer(this.getConstraints(word), word);
            if (receivedWord) {
                this.setWord(receivedWord, word);
            } else {
                word.letters.forEach((l: Letter) => {
                    l.char = l.char ? l.char : "*";
                });
            }
        }
    }*/

    private async findWord(difficulty: Difficulty, index: number): Promise<boolean> {
        if (index === this.crossword.words.length) {
            return true;
        }

        const receivedWord: DatamuseWord[] = await this.getWordsFromServer(
            this.getConstraints(this.crossword.words[index]), this.crossword.words[index]);

        let isSuccess: boolean = false;
        for (const word of receivedWord) {
                this.setWord(word, this.crossword.words[index]);
                if (await this.findWord(difficulty, index + 1)) {
                    isSuccess = true;
                    break;
                } else {
                    this.unsetWord(this.crossword.words[index]);
                }
            }

        return isSuccess;
    }

    private async getWordsFromServer(constraint: string, word: Word): Promise<Array<DatamuseWord>> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: constraint,
                easy: false
            },
            json: true
        };

        return await Request(LEXICAL_SERVICE_URL, options) as Array<DatamuseWord>;
    }

    private setWord(receivedWord: DatamuseWord, gridWord: Word): void {
        for (let i: number = 0; i < gridWord.letters.length; i++) {
            gridWord.letters[i].char = gridWord.letters[i].char === "" ? receivedWord.word[i] : gridWord.letters[i].char;
            gridWord.letters[i].count++;
        }
        gridWord.definitions = receivedWord.defs;
    }

    private unsetWord(word: Word): void {
        for (const letter of word.letters) {
            if ((--letter.count) === 0) {
                letter.char = "";
            }
        }
    }

    private getConstraints(word: Word): string {
        let constraint: string = "";
        word.letters.forEach((letter: Letter) => {
            constraint += letter.char === "" ? "?" : letter.char;
        });

        return constraint;
    }

    private displayGrid(): void {
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

}
