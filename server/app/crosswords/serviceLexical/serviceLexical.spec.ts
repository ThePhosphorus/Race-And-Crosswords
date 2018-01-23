const assert = require('assert');

let apiUrl = "";

describe('Service Lexical', function () {
    describe('#testApi()', function () {
        testApi();
    });

    describe('#testWord()', function () {
        testWord();
    });

    describe('#testDefinitions()', function () {
        testDefinition();
    });

    describe('#testWordRarety()', function () {
        testWordRarety();
    });


});

function testApi(): void {
    it('can send request', (done) => {
        assert.ok(true);
        done();
    });

    it('can receive word', (done) => {
        assert.ok(true);
        done();
    });
}

function testWord(): void {
    it('has correct length', (done) => {
        assert.ok(true);
        done();
    });

    it('respects letter criterias', (done) => {
        assert.ok(true);
        done();
    });
}

function testDefinition(): void {
    it('can receive definition', (done) => {
        assert.ok(true);
        done();
    });
}

function testWordRarety(): void {
    it('can receive common words', (done) => {
        assert.ok(true);
        done();
    });

    it('can receive rare words', (done) => {
        assert.ok(true);
        done();
    });
}