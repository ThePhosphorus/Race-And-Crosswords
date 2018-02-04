import * as assert from "assert";
import { CrosswordGrid, Difficulty, Word, Letter } from "../../../../common/communication/crossword-grid";
import { GridGenerator } from "./grid-generator";

const gridGenerator: GridGenerator = new GridGenerator();
const btRatio: number = 0.4;
const gridSize: number = 5;

// tslint:disable-next-line:max-func-body-length
gridGenerator.getNewGrid(Difficulty.Easy, gridSize, btRatio).then( (grid: CrosswordGrid) => {
    describe("Grid generation", () => {
        describe("When the grid is generated", () => {
            it ("should give a grid with the right size", (done: MochaDone) => {
                assert.strictEqual(grid.size, gridSize, "Attribute size of grid is not the expected size.");
                assert.strictEqual(grid.words.length, gridSize * gridSize, "Vertical length is not the right length");
                done();
             });

            it("should give us a grid with the right amount of blackTiles", (done: MochaDone) => {
                const nbOfBlackTilesExpected: number = btRatio * gridSize * gridSize;
                let nbOfBlackTiles: number = 0;
                grid.grid.forEach((letter: Letter) => {
                    if (letter.isBlackTile) {nbOfBlackTiles++; }
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
         });
     });
 });
