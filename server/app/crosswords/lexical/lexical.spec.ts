import { Datamuse, HARD_THRESHOLD } from "./datamuse";
import * as assert from "assert";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

describe("Service Lexical", () => {
    const datamuse: Datamuse = new Datamuse();

    describe("When the api is called", () => {
        it("should receive our request", (done: MochaDone) => {
            assert.doesNotThrow(() => { datamuse.getWord("????", true); }, Error);
            done();
        });
    });

    describe("When the words are received", () => {
        it("should not give us an empty array", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWord(testString, true).then((strResponse: string) => {
                const word: DatamuseWord = JSON.parse(strResponse) as DatamuseWord;
                assert.notEqual(word, undefined, "Did not receive array of word.");
                done();
            });
        });

        it("should have the correct length", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWord(testString, true).then((strResponse: string) => {
                const word: DatamuseWord = JSON.parse(strResponse) as DatamuseWord;
                assert.notEqual(word, undefined, "Did not receive a word");
                assert.strictEqual(word.word.length, testString.length, "Did not receive the right length");

                done();
            });
        });

        it("should respect the letter criterias", (done: MochaDone) => {
            const testString: string = "a????";
            datamuse.getWord(testString, true).then((strResponse: string) => {
                if (strResponse == null) {
                    assert.fail("received null or undefined from datamuse");
                } else {
                    const word: DatamuseWord = JSON.parse(strResponse) as DatamuseWord;

                    assert.notEqual(word, undefined, "Did not receive a word");
                    assert.strictEqual(word.word.length, testString.length, "Did not receive the right length");
                    for (let i: number = 0; i < testString.length; i++) {
                        if (testString.charAt(i) !== "?") {
                            assert.strictEqual(word.word.charAt(i), testString.charAt(i), "Letter criteria is not respected.");
                        }
                    }
                }
                done();
            });
        });

        it("should have definitions", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWord(testString, true).then((strResponse: string) => {
                const word: DatamuseWord = JSON.parse(strResponse) as DatamuseWord;
                assert.notEqual(word.defs.length, 0, "received no definition for the word : " + word.word);
                done();
            });
        });

        it("should have definitions that don't containt the word itself", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWord(testString, true).then((strResponse: string) => {
                const word: DatamuseWord = JSON.parse(strResponse) as DatamuseWord;

                word.defs.forEach((definition: string) => {
                    const defWords: string[] = definition.split(" ");
                    defWords.forEach((defWord: string) => {
                        assert.notStrictEqual(defWord, word.word,
                                              "Definition \"" + definition + "\" contains the word \"" + word.word + "\"");
                    });
                });
                assert.notEqual(word.defs.length, 0, "Received no definition for the word : " + word.word);
                done();
            });
        });

    });

    describe("When requested by rarity", () => {
        it("should receive common words", (done: MochaDone) => {
            const testString: string = "???e";
            datamuse.getWord(testString, true).then((strResponse: string) => {
                const word: DatamuseWord = JSON.parse(strResponse) as DatamuseWord;
                assert.notEqual(word, undefined, "Did not receive any word");
                assert.ok(word.score > HARD_THRESHOLD);
                done();
            });
        });

        it("should receive rare words", (done: MochaDone) => {
            const testString: string = "???e";
            datamuse.getWord(testString, true).then((strResponse: string) => {
                const word: DatamuseWord = JSON.parse(strResponse) as DatamuseWord;
                assert.notEqual(word, undefined, "Did not receive any word");
                assert.ok(word.score > HARD_THRESHOLD);
                done();
            });
        });
    });
});
