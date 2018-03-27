import * as assert from "assert";
import { SCrosswordGrid } from "../scrossword-grid/scrossword-grid";
import { Difficulty } from "../../../../../common/crossword/enums-constants";
import { Word } from "../../../../../common/crossword/word";
import { Letter } from "../../../../../common/crossword/letter";

describe(" Server Crossword Grid", () => {

    describe("When a correct word is added", () => {
        const crossword: SCrosswordGrid = new SCrosswordGrid();
        const word: Word = new Word();
        const wordString: string = "word";
        const defs: string[] = new Array<string>();

        defs.push("def1");
        defs.push("def2");

        let i: number  = 0;
        while (i < wordString.length) {
            const letter: Letter = new Letter("", i);
            crossword.grid.push(letter);
            word.letters.push(letter);
            i++;
        }

        it("should succeed", () => {
            assert.ok(
                crossword.addWord(wordString, defs, word , Difficulty.Easy)
            );

        });

        it("should add the word", () => {
            assert.equal(crossword.words.length, 1, "Did not add the word");
        });

        it("should still be linked", () => {
            assert.equal(crossword.words[0], word);
        });

        it("should add the correct word", () => {
            assert.equal(word.toString(), wordString, "Added : " + word.toString() + " wanted : " + word );
        });

        it("should add the correct definition", () => {
            assert.equal(word.definitions[0], defs[0] , "Added : " + word.definitions[0] + " wanted : " + defs[0] );
        });

    });

    describe("When a medium word is added", () => {
        const crossword: SCrosswordGrid = new SCrosswordGrid();
        const word: Word = new Word();
        const wordString: string = "word";
        const defs: string[] = new Array<string>();

        defs.push("def1");
        defs.push("def2");

        let i: number  = 0;
        while (i < wordString.length) {
            const letter: Letter = new Letter("", i);
            crossword.grid.push(letter);
            word.letters.push(letter);
            i++;
        }

        it("should succeed", () => {
            assert.ok(
                crossword.addWord(wordString, defs, word , Difficulty.Medium)
            );

        });

        it("should add the second definition", () => {
            assert.equal(word.definitions[0], defs[1] , "Added : " + word.definitions[0] + " wanted : " + defs[1] );
        });

    });

    describe("When a hard word is added", () => {
        const crossword: SCrosswordGrid = new SCrosswordGrid();
        const word: Word = new Word();
        const wordString: string = "word";
        const defs: string[] = new Array<string>();

        defs.push("def1");
        defs.push("def2");

        let i: number  = 0;
        while (i < wordString.length) {
            const letter: Letter = new Letter("", i);
            crossword.grid.push(letter);
            word.letters.push(letter);
            i++;
        }

        it("should succeed", () => {
            assert.ok(
                crossword.addWord(wordString, defs, word , Difficulty.Hard)
            );

        });

        it("should add the second definition", () => {
            assert.equal(word.definitions[0], defs[1] , "Added : " + word.definitions[0] + " wanted : " + defs[1] );
        });

    });

    describe("When a duplicate word is added", () => {
        const crossword: SCrosswordGrid = new SCrosswordGrid();
        const oldWord: Word = new Word();
        const word: Word = new Word();
        const wordString: string = "word";
        const defs: string[] = new Array<string>();

        defs.push("def1");
        defs.push("def2");

        let i: number  = 0;
        while (i < wordString.length) {
            const letter: Letter = new Letter("", i);
            const oldLetter: Letter = new Letter("", wordString.length + i);
            crossword.grid.push(oldLetter);
            crossword.grid.push(letter);
            oldWord.letters.push(oldLetter);
            word.letters.push(letter);
            i++;
        }

        crossword.addWord(wordString, defs, oldWord , Difficulty.Easy);
        it("should not succeed", () => {
            assert.ok(
                !crossword.addWord(wordString, defs, word , Difficulty.Easy)
            );

        });

        it("should not add the word", () => {
            assert.ok(crossword.words.length < 2 , "It added the word");
        });

    });

    describe("When a word without definitions is added", () => {
        const crossword: SCrosswordGrid = new SCrosswordGrid();
        const word: Word = new Word();
        const wordString: string = "word";
        const defs: string[] = new Array<string>();

        let i: number  = 0;
        while (i < wordString.length) {
            const letter: Letter = new Letter("", i);
            crossword.grid.push(letter);
            word.letters.push(letter);
            i++;
        }

        it("should not succeed", () => {
            assert.ok(
                !crossword.addWord(wordString, defs, word , Difficulty.Easy)
            );

        });

        it("should not add the word", () => {
            assert.ok(crossword.words.length < 1 , "It added the word");
        });
    });

    describe("When a word is removed", () => {
        const crossword: SCrosswordGrid = new SCrosswordGrid();
        const word: Word = new Word();
        const wordString: string = "word";
        const defs: string[] = new Array<string>();

        defs.push("def1");
        defs.push("def2");

        let i: number  = 0;
        while (i < wordString.length) {
            const letter: Letter = new Letter("", i);
            crossword.grid.push(letter);
            word.letters.push(letter);
            i++;
        }
        word.id = word.letters[0].id;
        crossword.addWord(wordString, defs, word , Difficulty.Easy);

        it("should get removed word", () => {
            assert.equal(
                crossword.removeWord(0),
                word
            );
        });

        it("should not remove a non existant word", () => {
            assert.equal(crossword.removeWord(0), null , "It added the word");
        });
    });
});
