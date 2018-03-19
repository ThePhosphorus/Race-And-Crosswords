import * as assert from "assert";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { EmptyGridGenerator, GRID_SIZE } from "./empty-grid-generator";

describe(" Empty grid generation", () => {
    describe("When the empty grid is generated", () => {
        it("should give a grid with the right size", () => {
            const grid: CrosswordGrid = new EmptyGridGenerator().getNewGrid();
            assert.strictEqual(grid.size, GRID_SIZE, "Attribute size of grid is not the expected size.");
            assert.strictEqual(grid.grid.length, GRID_SIZE * GRID_SIZE, "Vertical length is not the right length");
        });

        it("should give us a grid with no blackTiles in the first row and the first column ", () => {
            const grid: CrosswordGrid = new EmptyGridGenerator().getNewGrid();
            for (let i: number = 0; i < GRID_SIZE; i++) {
                if (grid.grid[i].isBlackTile) {
                    assert.fail("Detected blackTile on the first row");
                } else if (grid.grid[i * GRID_SIZE].isBlackTile) {
                    assert.fail("Detected blackTile on the first column");
                }
            }
        });
    });
});
