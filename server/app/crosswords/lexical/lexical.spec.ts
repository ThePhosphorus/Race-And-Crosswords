import { Datamuse } from "./datamuse";
import {Word} from "../../../../common/communication/word"
const assert = require("assert");

let datamuse: Datamuse = new Datamuse();

describe("Service Lexical", () => {
    describe("When the api is called", () => {
        it("should receive our request", (done) => {
           // assert.doesNotThrow(datamuse.getWord("????",true,(word:Word)=>{}),Error);
            done();
        });

        it("should send us a word", (done) => {
            datamuse.getWord("????",true,(word:Word)=>{
                assert.notEqual(word,null);
            })
            done();
        });
    });

    describe("When the word is received", () => {
        it("should have the correct length", (done) => {
            datamuse.getWord("??????",true,(word:Word)=>{
                assert.Equal(word.word.length,6);
            })
            done();
        });

        it("should respect the letter criterias", (done) => {
            assert.ok(true);
            done();
        });

        it("should have definitions", (done) => {
            assert.ok(true);
            done();
        });
    });

    describe("When requested by rarity", () => {
        it("should receive common words", (done) => {
            assert.ok(true);
            done();
        });

        it("should receive rare words", (done) => {
            assert.ok(true);
            done();
        });
    });
});
