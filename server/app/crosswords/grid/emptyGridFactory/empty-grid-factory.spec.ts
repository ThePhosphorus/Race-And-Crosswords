import * as assert from "assert";
import { CrosswordGrid} from "../../../../../common/communication/crossword-grid";
import { EmptyGridFactory } from "./empty-grid-factory";

const GRID_SIZE: number = 10;

describe(" Empty grid generation", () => {
    describe("When the empty grid is generated", () => {
        it("should give a grid with the right size", (done: MochaDone) => {
            for (let i: number = GRID_SIZE; i <= GRID_SIZE; i++) {
                const grid: CrosswordGrid = new EmptyGridFactory().getNewGrid(i);
                assert.strictEqual(grid.size, i, "Attribute size of grid is not the expected size.");
                assert.strictEqual(grid.grid.length, i * i, "Vertical length is not the right length");
            }
            done();
        });

        it("should give us a grid with no blackTiles in the first row and the first column ", (done: MochaDone) => {
            const grid: CrosswordGrid = new EmptyGridFactory().getNewGrid(GRID_SIZE);
            for (let i: number = 0; i < GRID_SIZE; i++) {
                if (grid.grid[i].isBlackTile) {
                    assert.fail("Detected blackTile on the first row");
                } else if (grid.grid[i * GRID_SIZE].isBlackTile) {
                    assert.fail("Detected blackTile on the first column");
                }
            }
            done();
        });
    });
});
