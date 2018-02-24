import * as assert from "assert";
import { CrosswordGrid, Difficulty, Letter, Orientation, Word } from "../../../../common/communication/crossword-grid";
import { GridGenerator } from "./grid-generator";

const gridGenerator: GridGenerator = new GridGenerator();
const gridSize: number = 5;

// tslint:disable-next-line:max-func-body-length

describe("Grid generation", () => {
    describe("When the grid is generated", () => {
        it("should give a grid with the right size", (done: MochaDone) => {
            return gridGenerator.getNewGrid(Difficulty.Easy, gridSize).then((grid: CrosswordGrid) => {
                assert.strictEqual(grid.size, gridSize, "Attribute size of grid is not the expected size.");
                assert.strictEqual(grid.grid.length, gridSize * gridSize, "Vertical length is not the right length");
            });
        });

        it("should give us a grid with no blackTiles in the f irst row and the first column ", (done: MochaDone) => {
            return gridGenerator.getNewGrid(Difficulty.Easy, gridSize).then((grid: CrosswordGrid) => {
                for (let i: number = 0; i < gridSize; i++) {
                    if (grid.grid[i].isBlackTile) {
                        assert.fail("Detected blackTile on the first row");
                    } else if (grid.grid[i * gridSize].isBlackTile) {
                        assert.fail("Detected blackTile on the first column");
                    }
                }
            });
        });

        it("should have a word on each colomn/row", (done: MochaDone) => {
            return gridGenerator.getNewGrid(Difficulty.Easy, gridSize).then((grid: CrosswordGrid) => {
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
                    assert.ok(hasDownWord[i], "There is no word on column : " + i);
                }
            });
        });

        it("should give us words with definitions ", (done: MochaDone) => {
            return gridGenerator.getNewGrid(Difficulty.Easy, gridSize).then((grid: CrosswordGrid) => {
                grid.words.forEach((word: Word) => {
                    assert.ok(word.definitions.length > 0, " Word : " + word.id);
                });
            });
        });

        it("should not have apostrophe or apostrophe", (done: MochaDone) => {
            return gridGenerator.getNewGrid(Difficulty.Easy, gridSize).then((grid: CrosswordGrid) => {
                grid.grid.forEach((tile: Letter) => {
                    if (!tile.isBlackTile) {
                        assert.notEqual(tile.char, "-", "Has hypen");
                        assert.notEqual(tile.char, "'", "Has apostrophe");
                    }
                });
            });
        });

        it("should not have special letters (accents, etc)", (done: MochaDone) => {
            return gridGenerator.getNewGrid(Difficulty.Easy, gridSize).then((grid: CrosswordGrid) => {
                grid.grid.forEach((tile: Letter) => {
                    if (!tile.isBlackTile) {
                        assert.ok(tile.char.normalize("NFD").length === 1, "Has character : " + tile.char);
                    }
                });
            });
        });

        it("should not have duplicate word", (done: MochaDone) => {
            return gridGenerator.getNewGrid(Difficulty.Easy, gridSize).then((grid: CrosswordGrid) => {
                const words: string[] = new Array<string>();
                grid.words.forEach((gridWord: Word) => {
                    let wordString: string = "";
                    gridWord.letters.forEach((letter: Letter) => {
                        wordString += letter.char;
                    });
                    assert.equal(words.indexOf(wordString), -1, "Duplicate of : " + wordString);
                    words.push(wordString);
                });
            });
        });

    });
});
