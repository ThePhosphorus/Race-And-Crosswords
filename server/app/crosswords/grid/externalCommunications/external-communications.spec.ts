import * as assert from "assert";
import { ExternalCommunications } from "./external-communications";
import { Word } from "../../../../../common/crossword/word";
import { Letter } from "../../../../../common/crossword/letter";

// tslint:disable: no-floating-promises

const externalCommunication: ExternalCommunications = new ExternalCommunications();
let testWord: string;

describe("External Communications", () => {
    it("should find word with constraints", (done: MochaDone) => {
        const wordLength: number = 5;
        let constraint: string = "";
        for (let i: number = 0; i < wordLength; i++) {
            constraint += "?";
        }

        externalCommunication.getWordsFromServer(constraint, true).then((str: string) => {
            if (str != null) {
                testWord = str;
            } else {
                assert.fail("could not find easy word");
            }
            done();
        });
    });

    it("should find word with letters", (done: MochaDone) => {
        const word: Word = new Word();
        let i: number = 0;
        while (i < testWord.length) {
            word.letters.push(new Letter());
            i++;
        }

        externalCommunication.getDefinitionsFromServer(testWord).then((defs: string[]) => {
            assert.notEqual(defs, undefined, "Did not fetch definitions");
            done();
        });
    });

    it("should find Easy word", (done: MochaDone) => {
        const word: Word = new Word();
        const wordLength: number = 5;
        let constraint: string = "";
        for (let i: number = 0; i < wordLength; i++) {
            word.letters.push(new Letter());
            constraint += "?";
        }

        externalCommunication.getWordsFromServer(constraint, true).then((str: string) => {
            if (str == null)  {
                assert.fail("could not find easy word");
            }
            done();
        });
    });

    it("should find Hard word", (done: MochaDone) => {
        const word: Word = new Word();
        const wordLength: number = 5;
        let constraint: string = "";
        for (let i: number = 0; i < wordLength; i++) {
            word.letters.push(new Letter());
            constraint += "?";
        }

        externalCommunication.getWordsFromServer(constraint, false).then((datamuseWord: string) => {
            if (datamuseWord === undefined) {
                assert.fail("could not find hard word");
            }
            done();
        });
    });

    it("should not find fake words", (done: MochaDone) => {
        const fakeWord: string = "csdjbn";
        const word: Word = new Word();
        let i: number = 0;
        while (i < fakeWord.length) {
            word.letters.push(new Letter());
            i++;
        }

        externalCommunication.getDefinitionsFromServer(fakeWord).then((defs: string[]) => {
            assert.equal(defs, undefined, "Found word for : " + fakeWord);
            done();
        });
    });
});
