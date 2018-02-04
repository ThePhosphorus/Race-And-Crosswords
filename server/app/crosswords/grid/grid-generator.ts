import { Word, CrosswordGrid, Letter, Difficulty } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";

const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-words";

export class GridGenerator {

    public getNewGrid(difficulty: Difficulty, size: number, blackTileRatio: number): CrosswordGrid {
        const grid: CrosswordGrid = new CrosswordGrid();
        this.initializeGrid(grid, size, blackTileRatio);

        return grid;
    }

    public initializeGrid(grid: CrosswordGrid, size: number, blackTileRatio: number): void {
        grid.size = size;
        grid.grid = new Array<Letter>();
        this.generateBlackTiles(grid, blackTileRatio);
    }

    private generateBlackTiles(grid: CrosswordGrid, blackTileRatio: number): void {
        const numberOfBlackTile: number = grid.size * grid.size * blackTileRatio;
        const blackTiles: Set<Position> = new Set<Position>();
        while (blackTiles.size < numberOfBlackTile) {
            const id: number = Math.floor(Math.random() * (grid.size * grid.size));
            if (!grid.grid[id]) {
                grid.grid[id] = new Letter();
            }
            grid.grid[id].isBlackTile = true;
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
                // console.log(htmlString);
                callback(JSON.parse(htmlString) as Word[]);
            })
            .catch(() => {
                console.error("Could not get words from service lexical");
                callback(new Array<Word>());
            });
    }
}
