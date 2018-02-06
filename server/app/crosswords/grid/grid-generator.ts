import { Word, CrosswordGrid, Letter, Difficulty, Orientation, MIN_WORD_LENGTH } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

const MAX_TOTAL_ROLLBACKS: number = 10 ;
const MAX_WORD_ROLLBACKS: number = 3;
const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-word";

export class GridGenerator {

    private crossword: CrosswordGrid;
    private notPlacedWords: Word[];
    private rollbackCount: number = 0;

    public async getNewGrid(difficulty: Difficulty, size: number, blackTileRatio: number): Promise<CrosswordGrid> {
        this.crossword = new CrosswordGrid();
        this.initializeGrid(size);
        this.generateBlackTiles(blackTileRatio);
        this.initializeWords();
        await this.findWords(difficulty);
        this.cleanGrid();

        return this.crossword;
    }

    private initializeGrid(size: number): void {
        this.crossword.size = size;
        this.crossword.grid = new Array<Letter>(size * size);
        for (let i: number = 0; i < size * size; i++) {
            this.crossword.grid[i] = new Letter("", i);
        }
    }

    private generateBlackTiles(blackTileRatio: number): void {
        const maxBlackTile: number = this.crossword.size * this.crossword.size * blackTileRatio;
        let generatedBlackTiles: number = 0; // this.generateBasicBlackTiles();
        while (generatedBlackTiles < maxBlackTile) {
            const id: number = Math.floor(Math.random() * (this.crossword.size * this.crossword.size));
            if (this.isCorrectBlackTile(id) && this.isValidBlackTile(id)) {
                this.crossword.grid[id].isBlackTile = true;
                generatedBlackTiles++;

            }
        }
    }

    private isValidBlackTile(id: number): boolean {
        const acrossLetter: Letter[] = [];
        for (let i: number = id - (id % this.crossword.size); i < id + this.crossword.size - (id % this.crossword.size); i++) {
            acrossLetter.push(this.crossword.grid[i]);
        }
        const downLetters: Letter[] = [];
        for (let i: number = id % this.crossword.size; i < this.crossword.grid.length; i += this.crossword.size) {
            downLetters.push(this.crossword.grid[i]);
        }

        return id >= this.crossword.size &&
                id % this.crossword.size !== 0 &&
                this.getNumberOfWordsInLine(acrossLetter) > 0 &&
                this.getNumberOfWordsInLine(downLetters) > 0;
    }

    private isCorrectBlackTile(id: number): boolean {

        if (this.crossword.grid[id].isBlackTile) {
            return false;
        }
        if (id <= this.crossword.size || id % this.crossword.size === 0) {
            return false;
        }

        return true;
    }

    private getNumberOfWordsInLine(letters: Letter[]): number {
        let numberOfWords: number = 0;
        let numberOfLettersInCurrentWord: number = 0;
        for (const letter of letters) {
            if (letter.isBlackTile) {
                if (numberOfLettersInCurrentWord >= MIN_WORD_LENGTH) {
                    numberOfWords++;
                }
                numberOfLettersInCurrentWord = 0;
            } else {
                numberOfLettersInCurrentWord++;
            }
        }
        if (numberOfLettersInCurrentWord >= MIN_WORD_LENGTH) {
            numberOfWords++;
        }

        return numberOfWords;
    }

    private initializeWords(): void {
        this.notPlacedWords = new Array<Word>();
        let acrossWord: Word = new Word();
        let downWord: Word = new Word();
        for (let i: number = 0; i < this.crossword.size; i++) {
            for (let j: number = 0; j < this.crossword.size; j++) {
                acrossWord = this.initializeLetter(acrossWord, (this.crossword.size * i) + j, Orientation.Across);
                downWord = this.initializeLetter(downWord, (this.crossword.size * j) + i, Orientation.Down);
            }
            this.addWord(acrossWord, Orientation.Across);
            this.addWord(downWord, Orientation.Down);
            acrossWord = new Word();
            downWord = new Word();
        }
        this.notPlacedWords = this.notPlacedWords.reverse();
    }

    private initializeLetter(word: Word, tilePosition: number, orientation: Orientation): Word {
        if (!this.crossword.grid[tilePosition].isBlackTile) {
            if (word.letters.length === 0) {
                word.id = tilePosition;
            }
            word.letters.push(this.crossword.grid[tilePosition]);
        } else { // IF BLACK TILE
            this.addWord(word, orientation);
            word = new Word();
        }

        return word;
    }

    private getWordWeight(word: Word): number {
        let weight: number = 0;
        for (const letter of word.letters) {
            weight += letter.count;
        }

        return weight;
    }
    private sortWords(): void {
        this.notPlacedWords = this.notPlacedWords.sort((w1: Word, w2: Word) => this.getWordWeight(w1) - this.getWordWeight(w2));
    }

    private addWord(word: Word, orientation: Orientation): void {
        if (word.letters.length >= MIN_WORD_LENGTH) {
            word.orientation = orientation;
            this.notPlacedWords.push(word);
        }
    }

    private async findWords(difficulty: Difficulty): Promise<void> {

        await this.findWord(this.notPlacedWords.pop(), difficulty);

        while (this.notPlacedWords.length > 0) {
            if (this.rollbackCount > MAX_TOTAL_ROLLBACKS) {
                this.nukeGrid();
                this.rollbackCount = 0;
            }

            await this.findWord(this.notPlacedWords.pop(), difficulty);
            this.sortWords();
        }

    }

    private async findWord(word: Word, difficulty: Difficulty): Promise<void> {
        const constraint: string = this.getConstraints(word);
        if (constraint.indexOf("?") === -1) {
            this.backjump(word);
            this.rollbackCount++;

        } else {
            const isEasyWord: boolean = difficulty !== Difficulty.Hard;
            const receivedWord: DatamuseWord = await this.getWordsFromServer(constraint, word, isEasyWord);
            if (receivedWord !== undefined && this.isUnique(receivedWord)) {
                this.setWord(receivedWord, word, difficulty);
                this.crossword.words.push(word);
                this.displayGrid();
            } else {
                this.backjump(word);
                this.rollbackCount++;

            }
        }
    }

    private displayGrid(): void {
        // Used for debugging puposes
        let s: string = "";
        for (let i: number = 0; i < this.crossword.size; i++) {
            for (let j: number = 0; j < this.crossword.size; j++) {
                const l: Letter = this.crossword.grid[(this.crossword.size * i) + j];
                s += l.char !== "" ? l.char : (l.isBlackTile ? "#" : "-");
            }
            s += "\n";
        }
        console.log(s);

    }

    private isUnique(word: DatamuseWord): boolean {
        let isUnique: boolean = true;
        this.crossword.words.forEach((w: Word) => {
            isUnique = isUnique && w.letters.map((l: Letter) => l.char).reduce((acc: string, val: string) => acc += val) !== word.word;
        });

        return isUnique;
    }

    private async getWordsFromServer(constraint: string, word: Word, isEasyWord: boolean): Promise<DatamuseWord> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: constraint,
                easy: isEasyWord
            },
            json: true
        };

        return await Request(LEXICAL_SERVICE_URL, options) as DatamuseWord;
    }

    private setWord(receivedWord: DatamuseWord, gridWord: Word, difficulty: Difficulty): void {
        for (let i: number = 0; i < gridWord.letters.length; i++) {
            gridWord.letters[i].char = (gridWord.letters[i].char === "") ? receivedWord.word[i] : gridWord.letters[i].char;
            gridWord.letters[i].count++;
        }
        if (receivedWord.defs.length === 1 || difficulty === Difficulty.Easy) {
            gridWord.definitions.push(receivedWord.defs[0]);
        } else {
            gridWord.definitions.push(receivedWord.defs[1]);
        }
    }

    private unsetWord(word: Word): void {
        for (const letter of word.letters) {
            if ((--letter.count) <= 0) {
                letter.char = "";
            }
        }
    }
    private backjump(currentWord: Word): void {
       this.notPlacedWords.push(currentWord);
       let isProblemWord: boolean = false;
       while (!isProblemWord && this.crossword.words.length > 0) {
            const backtrackWord: Word = this.crossword.words.pop();
            this.notPlacedWords.push(backtrackWord);
            for (const newLetter of backtrackWord.letters) {
                for (const currentLetter of currentWord.letters) {
                    if (currentLetter.char !== "" && newLetter.id === currentLetter.id) {
                        isProblemWord = true;
                    }
                }
            }
            this.unsetWord(backtrackWord);
        }
       if ( ++currentWord.rollbackCount > MAX_WORD_ROLLBACKS) {
            currentWord.rollbackCount = 0;
            this.backjump(currentWord);
       }
    }

    private getConstraints(word: Word): string {
        let constraint: string = "";
        word.letters.forEach((letter: Letter) => {
            constraint += letter.char === "" ? "?" : letter.char;
        });

        return constraint;
    }

    private nukeGrid(): void {
        let blackTileCount: number = 0;
        this.crossword.grid.forEach((letter: Letter) => {
            letter.char = "";
            letter.count = 0;
            if (letter.isBlackTile) {
                blackTileCount++;
                letter.isBlackTile = false;
            }
        });
        this.generateBlackTiles(blackTileCount / (this.crossword.size * this.crossword.size));
        this.crossword.words = new Array<Word>();
        this.initializeWords();
        this.sortWords();
    }

    private cleanGrid(): void {
        for (const tile of this.crossword.grid) {
            if (tile.char === "") {
                tile.isBlackTile = true;
            } else {
                tile.char = tile.char.normalize("NFD")[0];
            }
        }
    }

}
