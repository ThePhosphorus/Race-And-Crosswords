import { Word, Orientation, Position, CrosswordGrid } from "../../../../common/communication/crossword-grid";
import * as request from "request-promise-native";

const MIN_WORD_LENGTH: number = 2;

export enum Difficulty {
    Easy= "Easy",
    Medium= "Medium",
    Hard= "Hard",
}

export class GridGenerator {

    private gridSize: number = 10;
    private blackTilePercentage: number = 0.2;
    private wordPlacement: WordPlacementList = new WordPlacementList();
    // private wordPlacement: [Orientation, Position, number][]; // Maybe we should make this into a class or struct
    private grid: CrosswordGrid;

    public getNewGrid(difficulty: Difficulty, size: number, blackTileRatio: number  ): CrosswordGrid {
        this.gridSize = size;
        this.blackTilePercentage = blackTileRatio;
        this.generateGrid();

        return this.grid;
    }

    private generateGrid(): void {
        this.generateEmptyGrid();
    }

    public generateEmptyGrid(): void {
        this.grid.down = new Array<Word[]>();
        this.grid.across = new Array<Word[]>();
        for (let i: number = 0; i < this.gridSize; i++) {
            this.grid.down.push(new Array<Word>());
            this.grid.across.push(new Array<Word>());
        }

        this.generateBlackTiles();
        this.generateAllEmptyWords();
        this.populateWordLists();
        // this.placeNextWord(0);
    }

    private generateBlackTiles(): void {
        const numberOfBlackTile: number = this.gridSize * this.gridSize * this.blackTilePercentage;
        for (let i: number = 0; i < numberOfBlackTile; i++) {
            const column: number = Math.floor (Math.random() * (this.gridSize - MIN_WORD_LENGTH)) + 1;
            const row: number = Math.floor (Math.random() * (this.gridSize - MIN_WORD_LENGTH)) + 1;
            this.grid.blackTiles[i] = new Position(column, row);
        }
    }

    private generateAllEmptyWords(): void { // Refactor to make shorter (fonction too long)
        this.grid.blackTiles.forEach((blackTile: Position) => {
            if (blackTile.column >= MIN_WORD_LENGTH) {
                this.grid.across[blackTile.row].push(
                    new Word(Orientation.Horizontal,
                             new Position(0, blackTile.row),
                             blackTile.column));
            }
            if (blackTile.column <= this.gridSize - MIN_WORD_LENGTH - 1) {
                this.grid.across[blackTile.row].push(
                    new Word(Orientation.Horizontal,
                             new Position(blackTile.column + 1, blackTile.row),
                             this.gridSize - blackTile.column + 1));
            }
            if (blackTile.row >= MIN_WORD_LENGTH) {
                this.grid.down[blackTile.column].push(
                    new Word(Orientation.Vertical,
                             new Position(blackTile.column, 0),
                             blackTile.row));
            }
            if (blackTile.row <= this.gridSize - MIN_WORD_LENGTH - 1) {
                this.grid.down[blackTile.column].push(
                    new Word(Orientation.Vertical,
                             new Position(blackTile.column, blackTile.row + 1),
                             this.gridSize - blackTile.row + 1));
            }
        });
    }

    public populateWordLists(): void {
        this.populateWordList(Orientation.Horizontal);
        this.populateWordList(Orientation.Vertical);

        this.getConstrainedWords(this.findConstraints(this.wordPlacement.currentWord), this.placeWord);
    }

    private populateWordList(orientation: Orientation): void {
        let words: Word[][];
        orientation === Orientation.Horizontal ?
        words = this.grid.down :
        words = this.grid.across;

        words.forEach((colomn: Word[]) => {
            colomn.forEach((word: Word) => {
                this.wordPlacement.addWord(word);
            });
        });
    }

    public getConstrainedWords(constraint: string, callback: (words: Word[]) => void): void {
        let url: string;
        if (true) { // Need to change the condition
            url = "http://localhost:3000/crossword/lexical/easy-word";
        } else {
            url = "http://localhost:3000/crossword/lexical/hard-word";
        }
        request(url)
            .then((htmlString: string) => {
                const words: Word[] = JSON.parse(htmlString);
                callback(words);
            })
            .catch(() => {
                // Do something
            });
    }

    private placeWord(words: Word[]): void {
        if (words.length > 0) {
            if (this.wordPlacement.next()) {
                this.wordPlacement.currentWord = words[0];
                this.getConstrainedWords(this.findConstraints(this.wordPlacement.currentWord), this.placeWord);
            }
        } else {
            // backtrack
        }
    }

    private findConstraints(word: Word): string {

       return word.orientation === Orientation.Horizontal ?
        this.findConstraintHorizontal(word) :
        this.findConstraintVertical(word);
}

    private findConstraintHorizontal(word: Word): string {
        let constraint: string;
        for (let i: number = word.position.column; i <= word.length; i++) {

            let foundConstraint: boolean = false;
            this.grid.down[i].forEach((oppositeWord: Word) => {

                if (word.position.row - oppositeWord.position.row < oppositeWord.length) {
                    constraint += oppositeWord.word[word.position.row - oppositeWord.position.row];
                    foundConstraint = true;
                }
        } );
            if (!foundConstraint) {
                constraint += "?";
            }
            }

        return constraint;
    }

    private findConstraintVertical(word: Word): string {
        let constraint: string;
        for (let i: number = word.position.row; i <= word.length; i++) {

            let foundConstraint: boolean = false;
            this.grid.across[i].forEach((oppositeWord: Word) => {

                if (word.position.column - oppositeWord.position.column < oppositeWord.length) {
                    constraint += oppositeWord.word[word.position.column - oppositeWord.position.column];
                    foundConstraint = true;
                }
        } );
            if (!foundConstraint) {
                constraint += "?";
            }
            }

        return constraint;
    }

    private cleanWord(word: Word): Word {
        return word;
    }
}

class WordPlacementList {
    private _orderedWords: Word[];
    private _currentIndex: number;
    private _isSorted: boolean;

    constructor() {
        this._isSorted = false;
        this._currentIndex = 0;
    }

    public set currentWord(word: Word) {
        this._orderedWords[this._currentIndex] = word;
    }

    public get currentWord(): Word {
        if (!this._isSorted) {
            this._orderedWords.sort((word1: Word, word2: Word) => word1.length - word2.length);
        }

        return this._orderedWords[this._currentIndex];
    }

    public next(): boolean {
        this._currentIndex++;

        return this._currentIndex < this._orderedWords.length;
    }

    public addWord(word: Word): void {
        this._orderedWords.push(word);
        this._isSorted = false;
    }
}
