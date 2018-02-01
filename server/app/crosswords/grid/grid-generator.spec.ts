const assert = require("assert");
import { Word, Orientation, Position } from "../../../../common/communication/crossword-grid";
import { GridGenerator } from "./grid-generator";

const gridGenerator: GridGenerator = new GridGenerator();

describe("Generation de la grille", () => {

    describe("When an empty grid is generated", () => {

        it("should be 10 by 10 ", () => {
            assert.ok(false);
        });

        it("the first row and column should not have black tiles", () => {
            assert.ok(false);
        });

        it("should have x% of black squares", () => {
            assert.ok(false);
        });

        it("each line/column should contain one or two words", () => {
            assert.ok(false);
        });

    });

    describe("When an word is requested", () => {

        it("should accept request", () => {
            gridGenerator.getWords("", (words: Word[]) => {
                assert.empty(words);
                console.log(words);
            });
        });

        it("should receive a word", () => {
            assert.ok(false);
        });

        it("should have a definition", () => {
            assert.ok(false);
        });

        it("should respect the constraints", () => {
            assert.ok(false);
        });

    });

    describe("When an word is cleaned", () => {

        it("should not have accents or special letters", () => {
            assert.ok(false);
        });

        it("should not have hyphens or apostrophies", () => {
            assert.ok(false);
        });

    });

    describe("When a grid is completed", () => {

        it("should not have multiples of the same word", () => {
            assert.ok(false);
        });

    });

    describe("When the generator is called", () => {

        it("should be able to generate an 'easy' grid", () => {
            assert.ok(false);
        });

        it("should be able to generate a 'normal' grid", () => {
            assert.ok(false);
        });

        it("should be able to generate a 'hard' grid", () => {
            assert.ok(false);
        });

    });
});
