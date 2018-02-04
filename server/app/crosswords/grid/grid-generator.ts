import { Word, CrosswordGrid, Letter, Difficulty, Orientation } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";

const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-words";

export class GridGenerator {

    private crossword: CrosswordGrid;

    public getNewGrid(difficulty: Difficulty, size: number, blackTileRatio: number): CrosswordGrid {
        this.crossword = new CrosswordGrid();
        this.initializeGrid(size);
        this.generateBlackTiles(blackTileRatio);
        this.initializeWords();

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
            blackTiles.add(id);
            this.crossword.grid[id].isBlackTile = true;
        }
    }

    private initializeWords(): void {
        const acrossWord: Word = new Word();
        const downWord: Word = new Word();
        for (let i: number = 0; i < this.crossword.size; i++) {
            for (let j: number = 0; j < this.crossword.size; j++) {
                // ACROSS
                if (!this.crossword.grid[(this.crossword.size * i) + j].isBlackTile) {
                    acrossWord.letters.push(this.crossword.grid[(this.crossword.size * i) + j]);
                } else { // IF BLACK TILE
                    this.addWord(acrossWord, Orientation.Across);
                }
                // DOWN
                if (!this.crossword.grid[(this.crossword.size * j) + i].isBlackTile) {
                    downWord.letters.push(this.crossword.grid[(this.crossword.size * j) + i]);
                } else {
                    this.addWord(downWord, Orientation.Down);
                }
            }
            this.addWord(acrossWord, Orientation.Across);
            this.addWord(downWord, Orientation.Down);
        }
    }

    private addWord(word: Word, orientation: Orientation): void {
        if (word.letters.length > 1) {
            word.orientation = orientation;
            this.crossword.words.push(word);
        }
        word = new Word();
    }

    public getWordsFromServer(constraint: string): void {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: constraint,
                easy: true
            },
            json: true
        };

        Request(LEXICAL_SERVICE_URL, options)
            .then((words: Array<Word>) => {

                // this.placeWord(words as Word[]);

            }).catch(() => {
                console.error("Could not get words from service lexical");
            });
    }
}
