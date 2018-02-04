import { Datamuse, HARD_THRESHOLD } from "./datamuse";
import * as assert from "assert";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

describe("Service Lexical", () => {
    const datamuse: Datamuse = new Datamuse();

    describe("When the api is called", () => {
        it("should receive our request", (done: MochaDone) => {
                assert.doesNotThrow(() => {datamuse.getWords("????", true); }, Error);
                done();
         });
     });

    describe("When the words are received", () => {
        it("should not give us an empty array", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWords(testString, true).then( (strResponse: string) => {
                        const words: DatamuseWord[] = JSON.parse(strResponse) as Array<DatamuseWord>;
                        assert.notEqual(words.length, 0, "Received an empty array of words.\n Response:\n" + strResponse);
                        done();
                    });
         });
        it("should have the correct length", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWords(testString, true).then( (strResponse: string) => {
                const words: DatamuseWord[] = JSON.parse(strResponse) as Array<DatamuseWord>;

                words.forEach((wordStruct: DatamuseWord) => {
                    assert.strictEqual(wordStruct.word.length, testString.length, "Did not recieve the right length");
                });
                done();
            });
         });

        it("should respect the letter criterias", (done: MochaDone) => {
            const testString: string = "a??c?";
            datamuse.getWords(testString, true).then( (strResponse: string) => {
                const words: DatamuseWord[] = JSON.parse(strResponse) as Array<DatamuseWord>;

                words.forEach((wordStruct: DatamuseWord) => {
                    for ( let i: number = 0; i < testString.length ; i++ ) {
                        if (testString.charAt(i) !== "?") {
                            assert.strictEqual(wordStruct.word.charAt(i), testString.charAt(i), "Letter criteria is not respected.");
                        }
                    }
                    assert.strictEqual(wordStruct.word.length, testString.length, "Did not recieve the right length");
                });
                done();
            });
         });

        it("should have definitions", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWords(testString, true).then( (strResponse: string) => {
                const words: DatamuseWord[] = JSON.parse(strResponse) as Array<DatamuseWord>;

                words.forEach((wordStruct: DatamuseWord) => {
                    assert.notEqual(wordStruct.defs.length, 0, "Recieved no definition for the word : "  + wordStruct.word);
                });
                done();
             });
         });
     });

    describe("When requested by rarity", () => {
        it("should receive common words", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWords(testString, true).then( (strResponse: string) => {
                const words: DatamuseWord[] = JSON.parse(strResponse) as Array<DatamuseWord>;

                words.forEach((wordStruct: DatamuseWord) => {
                    assert.ok(wordStruct.score > HARD_THRESHOLD);
                });
                done();
            });
        });

        it("should receive rare words", (done: MochaDone) => {
            const testString: string = "????";
            datamuse.getWords(testString, true).then( (strResponse: string) => {
                const words: DatamuseWord[] = JSON.parse(strResponse) as Array<DatamuseWord>;

                words.forEach((wordStruct: DatamuseWord) => {
                    assert.ok(wordStruct.score > HARD_THRESHOLD);
                });
                done();
            });
        });
     });
});
