import { Word, CrosswordGrid, Letter, Difficulty } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";

const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-words";

export class GridGenerator {

    public getNewGrid(difficulty: Difficulty, size: number, blackTileRatio: number): CrosswordGrid {
        const grid: CrosswordGrid = new CrosswordGrid();
        this.initializeGrid(grid, size);
        this.generateBlackTiles(grid, blackTileRatio);
        this.initializeWords(grid);

        return grid;
    }

    private initializeGrid(grid: CrosswordGrid, size: number): void {
        grid.size = size;
        grid.grid = new Array<Letter>();
        for (let i: number = 0; i < size * size; i++) {
            grid.grid[i] = new Letter("");
        }
    }

    private generateBlackTiles(grid: CrosswordGrid, blackTileRatio: number): void {
        const numberOfBlackTile: number = grid.size * grid.size * blackTileRatio;
        const blackTiles: Set<number> = new Set<number>();
        while (blackTiles.size < numberOfBlackTile) {
            const id: number = Math.floor(Math.random() * (grid.size * grid.size));
            blackTiles.add(id);
            grid.grid[id].isBlackTile = true;
        }
    }

    private initializeWords(grid: CrosswordGrid): void {
        let acrossWord: Word = new Word();
        let downWord: Word = new Word();
        for (let i: number = 0; i < grid.size; i++) {
            for (let j: number = 0; j < grid.size; j++) {
                if (!grid.grid[(grid.size * i) + j].isBlackTile) {
                    acrossWord.letters.push(grid.grid[(grid.size * i) + j]);
                } else {
                    grid.words.push(acrossWord);
                    acrossWord = new Word();
                }

                if (!grid.grid[(grid.size * j) + i].isBlackTile) {
                    downWord.letters.push(grid.grid[(grid.size * j) + i]);
                } else {
                    grid.words.push(downWord);
                    downWord = new Word();
                }
            }
        }
    }

    public getWordsFromServer(constraint: string, callback: (words: Word[]) => void): void {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: "???e",
                easy: true
            },
            json: true
        };
        Request(LEXICAL_SERVICE_URL, options)
            .then((htmlString: string) => {
                callback(JSON.parse(htmlString) as Word[]);
            })
            .catch(() => {
                console.error("Could not get words from service lexical");
                callback(new Array<Word>());
            });
    }
}
