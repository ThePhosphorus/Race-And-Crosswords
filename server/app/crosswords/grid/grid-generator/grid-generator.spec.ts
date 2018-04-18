import * as assert from "assert";
import { GridGenerator } from "./grid-generator";
import { ExternalCommunications } from "../externalCommunications/external-communications";
import { Difficulty, Orientation } from "../../../../../common/crossword/enums-constants";
import { Word } from "../../../../../common/crossword/word";
import { Letter } from "../../../../../common/crossword/letter";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";

const gridGenerator: GridGenerator = new GridGenerator();
const communication: ExternalCommunications = new ExternalCommunications();
const GRID_SIZE: number = 10;
const DEFAULT_DIFFICULTY: Difficulty = Difficulty.Easy;

// tslint:disable-next-line:max-func-body-length
describe("Grid generation", () => {

    let grid: CrosswordGrid;

    before(async () => {
        return gridGenerator.getNewGrid(DEFAULT_DIFFICULTY, GRID_SIZE).then((g: CrosswordGrid) => grid = g).catch(() => {
            assert.fail("Promise rejection of grid");
        });
    });

    describe("When the grid is generated (easy)", () => {
        it("should give a grid with the right size", () => {
            assert.strictEqual(grid.size, GRID_SIZE, "Attribute size of grid is not the expected size.");
            assert.strictEqual(grid.grid.length, GRID_SIZE * GRID_SIZE, "Vertical length is not the right length");
        });

        it("should give us a grid with no blackTiles in the first row and the first column ", () => {
            for (let i: number = 0; i < GRID_SIZE; i++) {
                if (grid.grid[i].isBlackTile) {
                    assert.fail("Detected blackTile on the first row");
                } else if (grid.grid[i * GRID_SIZE].isBlackTile) {
                    assert.fail("Detected blackTile on the first column");
                }
            }
        });

        it("should have a word on each colomn/row", () => {
            const hasAcrossWord: boolean[] = new Array<boolean>(GRID_SIZE).fill(false, 0, GRID_SIZE - 1);
            const hasDownWord: boolean[] = new Array<boolean>(GRID_SIZE).fill(false, 0, GRID_SIZE - 1);
            for (const word of grid.words) {
                if (word.orientation === Orientation.Across) {
                    hasAcrossWord[Math.floor(word.id / GRID_SIZE)] = true;
                } else {
                    hasDownWord[word.id % GRID_SIZE] = true;
                }
            }
            for (let i: number = 0; i < GRID_SIZE; i++) {
                assert.ok(hasAcrossWord[i], "There is no word on row : " + i);
                assert.ok(hasDownWord[i], "There is no word on column : " + i);
            }
        });

        it("should give us words with definitions ", () => {
            grid.words.forEach((word: Word) => {
                assert.ok(word.definitions.length > 0, " Word : " + word.id);
            });
        });

        it("should not have apostrophe or apostrophe", () => {
            grid.grid.forEach((tile: Letter) => {
                if (!tile.isBlackTile) {
                    assert.notEqual(tile.char, "-", "Has hypen");
                    assert.notEqual(tile.char, "'", "Has apostrophe");
                }
            });
        });

        it("should not have special letters (accents, etc)", () => {
            grid.grid.forEach((tile: Letter) => {
                if (!tile.isBlackTile) {
                    assert.ok(tile.char.normalize("NFD").length === 1, "Has character : \"" + tile.char + "\"");
                }
            });
        });

        it("should not have duplicate word", () => {
            const words: string[] = new Array<string>();
            grid.words.forEach((gridWord: Word) => {
                assert.equal(words.indexOf(gridWord.toString()), -1, "Duplicate of : " + gridWord.toString());
                words.push(gridWord.toString());
            });
        });

        it("should have real words", (done: MochaDone) => {
            for (const word of grid.words) {
                communication.getDefinitionsFromServer(word.toString()).then((defs: string[]) => {
                    assert.notEqual(defs, null, word.toString() + " does not exist");
                    assert.notEqual(defs, null, word.toString() + " does not have defs");
                }).catch(() => {
                    assert.fail("Promise Rejection");
                    done();
                });
            }
            done();
        });

        it("should have correct definition", (done: MochaDone) => {
            for (const word of grid.words) {
                communication.getDefinitionsFromServer(word.toString()).then((defs: string[]) => {
                    assert.notEqual(defs, null, word.toString() + " does not exist");
                    assert.notEqual(defs, null, word.toString() + " does not have defs");
                    let isCorrectDefinition: boolean = false;
                    for (const def of defs) {
                        if (def === word.definitions[0]) {
                            isCorrectDefinition = true;
                        }
                    }
                    assert.ok(isCorrectDefinition, " got : " + word.definitions[0] + " for : " + word.toString());
                }).catch(() => {
                    assert.fail("Promise Rejection");
                    done();
                });
            }
            done();
        });

        it("should have easy words", (done: MochaDone) => {
            communication.getDefinitionsFromServer(grid.words[0].toString()).then((defs: string[]) => {
                assert.equal(grid.words[0].definitions[0],
                             defs[0],
                             grid.words[0].toString() + " does not use it's first definition");
                done();
            }).catch(() => {
                assert.fail("Promise Rejection");
                done();
            });
        });
    });

    describe("When the grid is generated by diffculty", () => {

        it("should create a medium grid", (done: MochaDone) => {
            gridGenerator.getNewGrid(Difficulty.Medium, GRID_SIZE).then((mediumGrid: CrosswordGrid) => {
                assert.notEqual(mediumGrid, undefined, "There is no grid");
                assert.notEqual(mediumGrid.words, undefined, "it does not have words");
                communication.getDefinitionsFromServer(mediumGrid.words[0].toString()).then((defs: string[]) => {
                    if (defs.length > 1) {
                        assert.notEqual(mediumGrid.words[0].definitions[0],
                                        defs[0],
                                        mediumGrid.words[0].toString() + " uses it's first definition");
                    }
                    done();
                }).catch(() => {
                    assert.fail("Promise Rejection");
                    done();
                });
            }).catch(() => {
                assert.fail("Promise Rejection");
                done();
            });
        });

        it("should create a Hard grid", (done: MochaDone) => {
            gridGenerator.getNewGrid(Difficulty.Medium, GRID_SIZE).then((hardGrid: CrosswordGrid) => {
                assert.notEqual(hardGrid, undefined, "There is no grid");
                assert.notEqual(hardGrid.words, undefined, "it does not have words");
                communication.getDefinitionsFromServer(hardGrid.words[0].toString()).then((defs: string[]) => {
                    if (defs.length > 1) {
                        assert.notEqual(hardGrid.words[0].definitions[0],
                                        defs[0],
                                        hardGrid.words[0].toString() + " uses it's first definition");
                    }
                    done();
                }).catch(() => {
                    assert.fail("Promise Rejection");
                    done();
                });
            }).catch(() => {
                assert.fail("Promise Rejection");
                done();
            });
        });
    });
});
