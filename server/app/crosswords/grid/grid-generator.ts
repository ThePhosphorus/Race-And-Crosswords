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
        this.getConstrainedWords(this.findConstraints(this.wordPlacement.currentWord), this.placeWord);
    }

    public generateEmptyGrid(): void {
        this.grid = new CrosswordGrid(this.gridSize);
        this.generateBlackTiles();
        this.generateAllEmptyWords();
        this.populateWordLists();
    }

    private generateBlackTiles(): void {
        const numberOfBlackTile: number = this.gridSize * this.gridSize * this.blackTilePercentage;
        for (let i: number = 0; i < numberOfBlackTile; i++) {
            const column: number = Math.floor (Math.random() * (this.gridSize - MIN_WORD_LENGTH)) + 1;
            const row: number = Math.floor (Math.random() * (this.gridSize - MIN_WORD_LENGTH)) + 1;
            this.grid.blackTiles.push(new Position(column, row));
        }
    }

    private generateAllEmptyWords(): void {
        this.generateEmptyWordsVertical();
        this.generateEmptyWordsHorizontal();
    }

    private generateEmptyWordsVertical(): void {
        for (let i: number = 0; i < this.gridSize; i++ ) {
            const currentBlackTiles: Position[] = [];
            this.grid.blackTiles.forEach((blackTile: Position) => {
                if (blackTile.column === i) {
                    currentBlackTiles.push(blackTile);
                }
            });
            if (currentBlackTiles.length === 0) {
                this.grid.down[i].push(new Word(Orientation.Vertical, new Position(i, 0), this.gridSize));
            } else {
                currentBlackTiles.sort((tile1: Position, tile2: Position) => tile1.row - tile2.row);
                for (let j: number = 0; j < currentBlackTiles.length; j++) {
                    if (j === 0) {
                        this.grid.down[i].push(new Word(Orientation.Vertical, new Position(i, 0), currentBlackTiles[j].row));
                    } else {
                        this.grid.down[i].push(new Word(Orientation.Vertical,
                                                        new Position(i, currentBlackTiles[j - 1].row + 1),
                                                        currentBlackTiles[j].row - currentBlackTiles[j - 1].row - 1));
                    }
                    this.grid.down[i].push(new Word(Orientation.Vertical,
                                                    new Position(i, 0),
                                                    this.gridSize - currentBlackTiles[j].row - 1));
                }
            }
        }
    }

    private generateEmptyWordsHorizontal(): void {
        for (let i: number = 0; i < this.gridSize; i++ ) {
            const currentBlackTiles: Position[] = [];
            this.grid.blackTiles.forEach((blackTile: Position) => {
                if (blackTile.row === i) {
                    currentBlackTiles.push(blackTile);
                }
            });
            if (currentBlackTiles.length === 0) {
                this.grid.across[i].push(new Word(Orientation.Horizontal, new Position(0, i), this.gridSize));
            } else {
                currentBlackTiles.sort((tile1: Position, tile2: Position) => tile1.column - tile2.column);
                for (let j: number = 0; j < currentBlackTiles.length; j++) {
                    if (j === 0) {
                        this.grid.down[i].push(new Word(Orientation.Horizontal, new Position(0, i), currentBlackTiles[j].column));
                    } else {
                        this.grid.down[i].push(new Word(Orientation.Horizontal,
                                                        new Position(i, currentBlackTiles[j - 1].column + 1),
                                                        currentBlackTiles[j].column - currentBlackTiles[j - 1].column - 1));
                    }
                    this.grid.down[i].push(new Word(Orientation.Horizontal,
                                                    new Position(i, 0),
                                                    this.gridSize - currentBlackTiles[j].column - 1));
                }
            }
        }
    }

    public populateWordLists(): void {
        this.populateWordList(Orientation.Horizontal);
        this.populateWordList(Orientation.Vertical);
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
                    constraint += oppositeWord.wordString[word.position.row - oppositeWord.position.row];
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
                    constraint += oppositeWord.wordSTring[word.position.column - oppositeWord.position.column];
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
