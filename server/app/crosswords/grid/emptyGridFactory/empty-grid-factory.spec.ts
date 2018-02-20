import * as assert from "assert";
import { CrosswordGrid} from "../../../../../common/communication/crossword-grid";
import { EmptyGridFactory } from "./empty-grid-factory";

const MAX_TESTED_SIZE: number = 10;
const gridSize: number = 10;

describe(" Empty grid generation", () => {
    describe("When the empty grid is generated", () => {
        it("should give a grid with the right size", (done: MochaDone) => {
            for (let i: number = 1; i <= MAX_TESTED_SIZE; i++) {
                const grid: CrosswordGrid = new EmptyGridFactory(i, 0).getNewGrid();
                assert.strictEqual(grid.size, i, "Attribute size of grid is not the expected size.");
                assert.strictEqual(grid.grid.length, i * i, "Vertical length is not the right length");
            }
            done();
        });

        it("should give us a grid with no blackTiles in the first row and the first column ", (done: MochaDone) => {
            const BLACKTILE_RATIO: number = 0.8;
            const grid: CrosswordGrid = new EmptyGridFactory(MAX_TESTED_SIZE, BLACKTILE_RATIO).getNewGrid();
            for (let i: number = 0; i < gridSize; i++) {
                if (grid.grid[i].isBlackTile) {
                    assert.fail("Detected blackTile on the first row");
                } else if (grid.grid[i * gridSize].isBlackTile) {
                    assert.fail("Detected blackTile on the first column");
                }
            }
            done();
        });
    });
});
