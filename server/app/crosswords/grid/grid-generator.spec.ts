import * as assert from "assert";
import { Difficulty, Letter, Orientation, Word } from "../../../../common/communication/crossword-grid";
import { GridGenerator } from "./grid-generator";
import { ExtendedCrosswordGrid } from "./extendedCrosswordGrid/extended-crossword-grid";
import {ExternalCommunications} from "./ExternalCommunications/external-communications";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

const gridGenerator: GridGenerator = new GridGenerator();
const communication: ExternalCommunications = new ExternalCommunications();
const gridSize: number = 10 ;
const difficulty: Difficulty = Difficulty.Easy;

// tslint:disable-next-line:max-func-body-length
describe("Grid generation", () => {

    let grid: ExtendedCrosswordGrid;

    beforeEach(() => {
        return gridGenerator.getNewGrid(difficulty, gridSize).then((g: ExtendedCrosswordGrid) => grid = g);
    });

    describe("When the grid is generated", () => {
        it("should give a grid with the right size", () => {
            assert.strictEqual(grid.size, gridSize, "Attribute size of grid is not the expected size.");
            assert.strictEqual(grid.grid.length, gridSize * gridSize, "Vertical length is not the right length");
        });

        it("should give us a grid with no blackTiles in the f irst row and the first column ", () => {
            for (let i: number = 0; i < gridSize; i++) {
                if (grid.grid[i].isBlackTile) {
                    assert.fail("Detected blackTile on the first row");
                } else if (grid.grid[i * gridSize].isBlackTile) {
                    assert.fail("Detected blackTile on the first column");
                }
            }
        });

        it("should have a word on each colomn/row", () => {
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
                    communication.getDefinitionsFromServer(word.toString()).then((datamuseWord: DatamuseWord) => {
                        assert.notEqual(datamuseWord, null, word.toString() + " does not exist");
                        assert.equal(datamuseWord.word, word.toString(), " Expected : " + word.toString() + " got : " + datamuseWord.word);
                        assert.notEqual(datamuseWord.defs, null, word.toString() + " does not have defs");
                    });
                }
                done();
            });
    });
});
