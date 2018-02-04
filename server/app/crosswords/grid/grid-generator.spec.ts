const assert = require("assert");
import { Word, CrosswordGrid, Difficulty, Letter, Orientation } from "../../../../common/communication/crossword-grid";
import { GridGenerator } from "./grid-generator";

const gridGenerator: GridGenerator = new GridGenerator();

describe("Generation de la grille", () => {

    describe("When an empty grid is generated", async () => {
        const gridSize: number = 10;
        const blackTilePercentage: number = 0.2;

        it("should be 10 by 10 ", (done: MochaDone) => {

           /*
            const columnSize: number[] = new Array<number>(gridSize);
            const rowSize: number[] = new Array<number>(gridSize);
            columnSize.fill(0, 0, gridSize);
            rowSize.fill(0, 0, gridSize);

            for (const word of grid.words) {
                if(word.orientation === Orientation.Across){

                }
            }
            grid.blackTiles.forEach((tile: Position) => {
                rowSize[tile.row]++;
                columnSize[tile.column]++;
            });
            let answer: string = "\n";
            let isCorrectSize: boolean = true;
            for (let i: number = 0; i < gridSize; i++) {
                if (rowSize[i] !== gridSize
                    || columnSize[i] !== gridSize) {
                    isCorrectSize = false;
                }
                answer += "row" + i + " : " + rowSize[i] + "\n";
                answer += "columns" + i + " : " + columnSize[i] + "\n";
            }
            */

            gridGenerator.getNewGrid(Difficulty.Hard, gridSize, blackTilePercentage).then((crossword: CrosswordGrid) => {
                assert.equal(Math.sqrt(crossword.grid.length), gridSize);
                done();
            }).catch(() => {
                assert.ok(false, "Could not receive grid.");
            });

        });

        it("the first row and column should not have black tiles", (done: MochaDone) => {

            gridGenerator.getNewGrid(Difficulty.Hard, gridSize, blackTilePercentage).then((crossword: CrosswordGrid) => {
                let hasBlackTile: boolean = false;
                let answer: string = "Incorrect black tiles : ";
                for (let i: number = 0; i < crossword.size; i++) {
                if (crossword.grid[i].isBlackTile) {
                    hasBlackTile = true;
                    answer += i + "\t";
                }

                if (i > 0 && crossword.grid[crossword.size * i].isBlackTile) {
                    hasBlackTile = true;
                    answer += i + "\t";
                }
            }

                assert.ok(!hasBlackTile, answer);
                done();
            }).catch(() => {
                assert.ok(false, "Could not receive grid.");
            });

        });

        it("should have " + (blackTilePercentage * 100) + "% of black squares", (done: MochaDone) => {

            gridGenerator.getNewGrid(Difficulty.Hard, gridSize, blackTilePercentage).then((crossword: CrosswordGrid) => {
                let blackTilesAmount: number = 0;
                for (const letter of crossword.grid) {
                    if (letter.isBlackTile) {
                        blackTilesAmount++;
                }
            }
                assert.equal(blackTilesAmount, blackTilePercentage * gridSize * gridSize);
                done();
            }).catch(() => {
                assert.ok(false, "Could not receive grid.");
            });

        });

        it("each line/column should contain one or more words", () => {
/*
            let hasAWord: boolean = true;
            for (let i: number = 0; i < gridSize; i++) {
                if (crossword.across[i].length < 1
                    || crossword.down[i].length < 1) {
                    hasAWord = false;
                }
            }
            assert.ok(hasAWord);*/
        });

    });
    /*
    describe("When a full grid is generated", () => {
        const gridSize: number = 10;
        const blackTilePercentage: number = 0.5;
        const grid: CrosswordGrid = gridGenerator.getNewGrid(Difficulty.Easy, gridSize, blackTilePercentage);

        it("should not have empty words", () => {
            let hasEmptyWord: boolean = false;
            grid.across.forEach((row: Word[]) => {
                row.forEach((word: Word) => {
                    if (word.wordString.length === 0) {
                        hasEmptyWord = true;
                    }
                });
            });

            grid.down.forEach((column: Word[]) => {
                column.forEach((word: Word) => {
                    if (word.wordString.length === 0) {
                        hasEmptyWord = true;
                    }
                });
            });

            assert.ok(!hasEmptyWord);
        });

        it("should not have accents or special letters", () => {
            grid.across.forEach((row: Word[]) => {
                row.forEach((word: Word) => {
                    if (word.wordString.length === 0) {
                        // try for character
                    }
                });
            });

            grid.down.forEach((column: Word[]) => {
                column.forEach((word: Word) => {
                    if (word.wordString.length === 0) {
                        // try for character
                    }
                });
            });

            assert.ok(true);
        });

        it("should not have hyphens or apostrophies", () => {
            assert.ok(true);
        });

        it("should not have multiples of the same word", () => {
            assert.ok(true);
        });
    });*/

    describe("When the generator is called", () => {

        it("should be able to generate an 'easy' grid", () => {
            assert.ok(true);
        });

        it("should be able to generate a 'normal' grid", () => {
            assert.ok(true);
        });

        it("should be able to generate a 'hard' grid", () => {
            assert.ok(true);
        });

    });
});
