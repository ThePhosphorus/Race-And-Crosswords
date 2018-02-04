import { Word, Orientation, Position, CrosswordGrid, Difficulty, MIN_WORD_LENGTH } from "../../../../common/communication/crossword-grid";
import * as Request from "request-promise-native";

const LEXICAL_SERVICE_URL: string = "http://localhost:3000/crosswords/lexical/query-words";

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
        this.getConstrainedWords(this.findConstraints(this.wordPlacement.currentWord));
    }

    public generateEmptyGrid(): void {
        this.grid = new CrosswordGrid(this.gridSize);

        this.generateBlackTiles();
        this.generateAllEmptyWords();
        this.populateWordLists();
    }

    private generateBlackTiles(): void {
        const numberOfBlackTile: number = this.gridSize * this.gridSize * this.blackTilePercentage;
        const blackTiles: Set<Position> = new Set<Position>();
        while (blackTiles.size < numberOfBlackTile) {
            const column: number = Math.ceil (Math.random() * (this.gridSize - MIN_WORD_LENGTH));
            const row: number = Math.ceil (Math.random() * (this.gridSize - MIN_WORD_LENGTH));
            blackTiles.add(new Position(column, row));
        }
        blackTiles.forEach((tile: Position) => {
            this.grid.blackTiles.push(tile);
        });
    }

    private generateAllEmptyWords(): void {
        this.generateEmptyWordsVertical();
        this.generateEmptyWordsHorizontal();
    }

    private generateEmptyWordsVertical(): void {
        for (let i: number = 0; i < this.gridSize; i++) {
            const columnTiles: Position[] = new Array<Position>();
            this.grid.blackTiles.forEach((tile: Position) => {
                if (tile.column === i) {
                    columnTiles.push(tile);
                }
            });
            columnTiles.sort((tile1: Position, tile2: Position) => {
                return tile1.row - tile2.row;
            });
            if (columnTiles.length > 0) {
                for (let j: number = 0; j < columnTiles.length; j++) {
                    let startingPosition: number;
                    j === 0 ? startingPosition = 0 : startingPosition = columnTiles[j].row + 1;
                    this.grid.down[i].push(
                        new Word(Orientation.Vertical,
                                 new Position(i, startingPosition), columnTiles[j].row - startingPosition ));
                    if (j === columnTiles.length - 1) {
                        this.grid.down[i].push(
                            new Word(Orientation.Vertical,
                                     new Position(i, columnTiles[j].row + 1), this.gridSize - 1 - columnTiles[j].row));
                            }
                }
            } else {
                this.grid.down[i].push(new Word( Orientation.Vertical, new Position(i, 0), this.gridSize) );
            }
        }
    }

    private generateEmptyWordsHorizontal(): void {
        for (let i: number = 0; i < this.gridSize; i++) {
            const rowTiles: Position[] = new Array<Position>();
            this.grid.blackTiles.forEach((tile: Position) => {
                if (tile.row === i) {
                    rowTiles.push(tile);
                }
            });

            rowTiles.sort((tile1: Position, tile2: Position) => {
                return tile1.column - tile2.column;
            });
            if (rowTiles.length > 0) {
                for (let j: number = 0; j < rowTiles.length; j++) {
                    let startingPosition: number;
                    j === 0 ? startingPosition = 0 : startingPosition = rowTiles[j].column + 1;
                    this.grid.across[i].push(
                        new Word(Orientation.Horizontal,
                                 new Position(startingPosition, i), rowTiles[j].column - startingPosition ));

                    if (j === rowTiles.length - 1) {
                        this.grid.across[i].push(
                            new Word(Orientation.Horizontal,
                                     new Position(i, rowTiles[j].column + 1), this.gridSize - 1 - rowTiles[j].column));
                    }
                }
            } else {
                this.grid.across[i].push(new Word(Orientation.Horizontal, new Position(i, 0), this.gridSize));
            }
        }
    }

    public populateWordLists(): void {
        this.wordPlacement = new WordPlacementList();
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

    public getConstrainedWords(constraint: string): void {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: constraint,
                easy: true
            },
            json: true
        };

        Request(LEXICAL_SERVICE_URL, options)
            .then((words: Array<Word>) => {
                try {
                    this.placeWord(words as Word[]);
                } catch (err) {
                    console.error("Could not place word");
                    console.error("Error : " + err);
                    throw err;
                }
            });
            // .catch(() => {
            //     console.error("Could not get words from service lexical");
            //     this.placeWord(new Array<Word>()); });
    }

    private placeWord(words: Word[]): void {
        if (words != null && words.length > 0) {
            this.wordPlacement.currentWord.definitions = words[0].definitions;
            this.wordPlacement.currentWord.wordString = words[0].wordString;
            if (this.wordPlacement.next()) {
                this.getConstrainedWords(this.findConstraints(this.wordPlacement.currentWord));
            }
        } else {
           // this.rollback();
        }
    }
/*
    private rollback(): void {
        const possibleFatalConstraints: string = this.findConstraints(this.wordPlacement.currentWord);
        let targetIndex: number = 0;
        let constraintsModifyingMask: string = "";
        for (let i: number = 0; i < possibleFatalConstraints.length; i++) {  } {
                if (this.wordPlacement.currentWord.orientation === Orientation.Vertical) {
                    const currentIndex: number =
                        this.wordPlacement.getIndexInList(Orientation.Horizontal,
                                                          new Position(this.wordPlacement.currentWord.position.column,
                                                                       this.wordPlacement.currentWord.position.row + i));
                    if (currentIndex > targetIndex) {
                        targetIndex = currentIndex;
                        constraintsModifyingMask = " ".repeat(this.wordPlacement.getWordAtIndex(targetIndex).length);
                        const indexToModify: number = this.wordPlacement.currentWord.position.column -
                                                    this.wordPlacement.getWordAtIndex(targetIndex).position.column;
                        constraintsModifyingMask =
                            constraintsModifyingMask.slice(0, indexToModify) +
                            this.wordPlacement.getWordAtIndex(targetIndex).wordString[indexToModify] +
                            constraintsModifyingMask.slice(indexToModify + 1, constraintsModifyingMask.length);
                    }
                } else {
                    // same thing for vertical
                    const currentIndex: number =
                        this.wordPlacement.getIndexInList(Orientation.Vertical,
                                                          new Position(this.wordPlacement.currentWord.position.row,
                                                                       this.wordPlacement.currentWord.position.column + i));
                    if (currentIndex > targetIndex) {
                        targetIndex = currentIndex;
                        constraintsModifyingMask = " ".repeat(this.wordPlacement.getWordAtIndex(targetIndex).length);
                        const indexToModify: number = this.wordPlacement.currentWord.position.row -
                                                    this.wordPlacement.getWordAtIndex(targetIndex).position.row;
                        constraintsModifyingMask =
                            constraintsModifyingMask.slice(0, indexToModify) +
                            this.wordPlacement.getWordAtIndex(targetIndex).wordString[indexToModify] +
                            constraintsModifyingMask.slice(indexToModify + 1, constraintsModifyingMask.length);
                    }
                }
            }
        this.wordPlacement.revert(targetIndex);
        const newConstraints: string = this.findConstraints(this.wordPlacement.currentWord);
        // modify constraint to prevent the letter contained in constraintsModifyingMask
        this.getConstrainedWords(newConstraints, this.placeWord);
    }
*/
    private findConstraints(word: Word): string {

       return word.orientation === Orientation.Horizontal ?
        this.findConstraintHorizontal(word) :
        this.findConstraintVertical(word);
}

    private findConstraintHorizontal(word: Word): string {
        let constraint: string = "";
        for (let i: number = word.position.column; i < word.length + word.position.column - 1; i++) {

            let foundConstraint: boolean = false;
            this.grid.down[i].forEach((oppositeWord: Word) => {

                if (word.position.row - oppositeWord.position.row < oppositeWord.length &&
                    oppositeWord.wordString !== null) {
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
        let constraint: string = "";
        for (let i: number = word.position.row; i < word.length + word.position.row - 1; i++) {

            let foundConstraint: boolean = false;
            this.grid.across[i].forEach((oppositeWord: Word) => {

                if (word.position.column - oppositeWord.position.column < oppositeWord.length &&
                    oppositeWord.wordString !== null) {
                    constraint += oppositeWord.wordString[word.position.column - oppositeWord.position.column];
                    foundConstraint = true;
                }
            });
            if (!foundConstraint) {
                constraint += "?";
            }
        }

        return constraint;
    }

    // private cleanWord(word: Word): Word {
    //     return word;
    // }
}

class WordPlacementList {
    private _orderedWords: Word[];
    private _currentIndex: number;
    private _isSorted: boolean;

    constructor() {
        this._isSorted = false;
        this._currentIndex = 0;
        this._orderedWords = new Array<Word>();
    }

    public set currentWord(word: Word) {
        this._orderedWords[this._currentIndex] = word;
    }

    public get currentWord(): Word {
        if (!this._isSorted) {
            this._orderedWords.sort((word1: Word, word2: Word) => word1.length - word2.length);
            this._isSorted = true;
        }

        return this._orderedWords[this._currentIndex];
    }

    public getWordAtIndex(index: number): Word {
        if (index >= this._orderedWords.length) {
            return this._orderedWords[this._currentIndex];
        } else {
            return this._orderedWords[index];
        }
    }

    public revert(targetIndex: number): void {
        for (let i: number = 0; i < targetIndex - this._currentIndex; i++) {
            this._orderedWords[this._currentIndex].wordString = "";
            this._currentIndex--;
        }
    }

    public next(): boolean {
        this._currentIndex++;

        return this._currentIndex < this._orderedWords.length;
    }

    public getIndexInList(orientation: Orientation, position: Position): number {
        return 0;
    }

    public addWord(word: Word): void {
        this._orderedWords.push(word);
        this._isSorted = false;
    }
}
