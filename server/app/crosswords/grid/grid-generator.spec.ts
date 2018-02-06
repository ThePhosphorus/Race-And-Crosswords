import * as assert from "assert";
import { CrosswordGrid, Difficulty, Letter, Orientation } from "../../../../common/communication/crossword-grid";
import { GridGenerator } from "./grid-generator";

const gridGenerator: GridGenerator = new GridGenerator();
const btRatio: number = 0.4;
const gridSize: number = 5;

// tslint:disable-next-line:max-func-body-length
gridGenerator.getNewGrid(Difficulty.Easy, gridSize, btRatio).then((grid: CrosswordGrid) => {
    describe("Grid generation", () => {
        describe("When the grid is generated", () => {
            it("should give a grid with the right size", (done: MochaDone) => {
                assert.strictEqual(grid.size, gridSize, "Attribute size of grid is not the expected size.");
                assert.strictEqual(grid.grid.length, gridSize * gridSize, "Vertical length is not the right length");
                done();
            });

            it("should give us a grid with the right amount of blackTiles", (done: MochaDone) => {
                const nbOfBlackTilesExpected: number = btRatio * gridSize * gridSize;
                let nbOfBlackTiles: number = 0;
                grid.grid.forEach((letter: Letter) => {
                    if (letter.isBlackTile) { nbOfBlackTiles++; }
                });
                assert.strictEqual(nbOfBlackTiles, nbOfBlackTilesExpected,
                                   "got " + nbOfBlackTiles + "black tiles instead of " + nbOfBlackTilesExpected);
                done();
            });

            it("should give us a grid with no blackTiles in the first row and the first collumn ", (done: MochaDone) => {
                for (let i: number = 0; i < gridSize; i++) {
                    if (grid.grid[i].isBlackTile) {
                        assert.fail("Detected blackTile on the first row");
                    } else if (grid.grid[i * gridSize].isBlackTile) {
                        assert.fail("Detected blackTile on the first collumn");
                    }
                }
                done();
            });

            it("should have a word on each colomn/row", (done: MochaDone) => {
                const hasAcrossWord: boolean[] = new Array<boolean>(gridSize).fill(false, 0, gridSize - 1);
                const hasDownWord: boolean[] = new Array<boolean>(gridSize).fill(false, 0, gridSize - 1);
                for (const word of grid.words) {
                    if (word.orientation === Orientation.Across) {
                        hasAcrossWord[Math.floor(word.id / gridSize)] = true;
                    } else {
                        hasDownWord[word.id % gridSize] = true;
                    }
                }
                for (let i: number = 0; i < gridSize; i++) {
                    assert.ok(hasAcrossWord[i], "There is no word on row : " + i);
                    assert.ok(hasDownWord[i], "There is no word on coloum : " + i);
                }
                done();
            });
        });
    });
});
