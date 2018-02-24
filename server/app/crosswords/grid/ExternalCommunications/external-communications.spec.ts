import * as assert from "assert";
import { ExternalCommunications } from "./external-communications";
import { Word, Letter } from "../../../../../common/communication/crossword-grid";
import { DatamuseWord } from "../../../../../common/communication/datamuse-word";

const externalCommunication: ExternalCommunications = new ExternalCommunications();
let testWord: string;

describe("External Communications", () => {
    it("should find word with constraints", (done: MochaDone) => {
        const word: Word = new Word();
        const wordLength: number = 5;
        let constraint: string = "";
        for (let i: number = 0; i < wordLength; i++) {
            word.letters.push(new Letter());
            constraint += "?";
        }

        externalCommunication.getWordsFromServer(constraint, word, true).then((datamuseWord: DatamuseWord) => {
            testWord = datamuseWord.word;
            assert.notEqual(datamuseWord, undefined);
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

        externalCommunication.getWordsFromServer(testWord, word, true).then((datamuseWord: DatamuseWord) => {
            assert.equal(datamuseWord.word, testWord, "Expected : " + testWord + " got : " + datamuseWord.word);
            assert.notEqual(datamuseWord.defs, undefined, "Did not fetch definitions");
            done();
        });
    });
});
