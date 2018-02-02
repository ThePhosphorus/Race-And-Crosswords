const assert = require("assert");
import { Word, Orientation, Position, CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { GridGenerator, Difficulty } from "./grid-generator";

const gridGenerator: GridGenerator = new GridGenerator();

describe("Generation de la grille", () => {

    describe("When an empty grid is generated", () => {

        const gridSize: number = 10;
        const blackTilePercentage: number = 0.3;
        const grid: CrosswordGrid = gridGenerator.getNewGrid(Difficulty.Easy, gridSize, blackTilePercentage);

        it("should be 10 by 10 ", () => {
            const columnSize: number[] = new Array<number>();
            const rowSize: number[] = new Array<number>();
            columnSize.fill(0, 0, gridSize - 1);
            rowSize.fill(0, 0, gridSize - 1);

            for (let i: number = 0; i < gridSize; i++) {
                grid.across[i].forEach((word: Word) => {
                    rowSize[i] += word.length;
                });
                grid.down[i].forEach((word: Word) => {
                    columnSize[i] += word.length;
                });
            }

            grid.blackTiles.forEach((tile: Position) => {
                rowSize[tile.row]++;
                columnSize[tile.row]++;
            });

            let isCorrectSize: boolean = true;
            for (let i: number = 0; i < gridSize; i++) {
                if (rowSize[i] !== gridSize
                    || columnSize[i] !== gridSize) {
                    isCorrectSize = false;
                }
            }
            assert.ok(isCorrectSize);
        });

        it("the first row and column should not have black tiles", () => {

            let hasBlackTile: boolean = false;
            grid.blackTiles.forEach((tile: Position) => {
               if ( tile.column === 0 ||
                tile.row === 0 ) {
                     hasBlackTile = true; }
            });

            assert.ok(!hasBlackTile);
        });

        it("should have " + (blackTilePercentage * 100) + "% of black squares", () => {
            assert.ok(grid.blackTiles.length === blackTilePercentage * gridSize * gridSize);
        });

        it("each line/column should contain one or more words", () => {

            let hasAWord: boolean = true;
            for (let i: number = 0; i < gridSize; i++) {
                if (grid.across[i].length < 1
                    || grid.down[i].length < 1) {
                    hasAWord = false;
                }
            }
            assert.ok(hasAWord);
        });

    });

    describe("When an word is requested", () => {

        it("should accept request", () => {
            assert.ok(true);
        });

        it("should receive a word", () => {
            assert.ok(true);
        });

        it("should have a definition", () => {
            assert.ok(true);
        });

        it("should respect the constraints", () => {
            assert.ok(true);
        });

    });

    describe("When an word is cleaned", () => {

        it("should not have accents or special letters", () => {
            assert.ok(true);
        });

        it("should not have hyphens or apostrophies", () => {
            assert.ok(true);
        });

    });

    describe("When a grid is completed", () => {

        it("should not have multiples of the same word", () => {
            assert.ok(true);
        });

    });

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
