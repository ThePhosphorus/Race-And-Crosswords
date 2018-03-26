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
    });
});
