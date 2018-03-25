import {MIN_WORD_LENGTH, Orientation } from "../../../../../common/crossword/enums-constants";
import { ExtendedCrosswordGrid } from "../extendedCrosswordGrid/extended-crossword-grid";
import {DEFAULT_BLACK_TILES} from "./default-black-tiles";
import { Letter } from "../../../../../common/crossword/letter";

const COMPLEXITY_THRESHOLD: number = 125;
export const GRID_SIZE: number = 10;

export class EmptyGridFactory {

    private _crossword: ExtendedCrosswordGrid;

    public getNewGrid(): ExtendedCrosswordGrid {
        let complexity: number;
        do {
            this._crossword = new ExtendedCrosswordGrid();
            this.initializeGrid();
            this.generateBlackTiles();
            complexity = this.getComplexity();
        } while (complexity > COMPLEXITY_THRESHOLD);

        return this._crossword;
    }

    private initializeGrid(): void {
        this._crossword.size = GRID_SIZE;
        this._crossword.grid = new Array<Letter>(GRID_SIZE * GRID_SIZE);
        for (let i: number = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            this._crossword.grid[i] = new Letter("", i);
        }
    }

    private generateBlackTiles(): void {
        this.generateDefaultBlackTiles();
        this.generateRandomBlackTiles();
    }

    private generateRandomBlackTiles(): void {
        let complexity: number;
        let tileCount: number = 0;
        do {
            const id: number = Math.floor(Math.random() * (this._crossword.size * this._crossword.size));
            if (!this._crossword.grid[id].isBlackTile) {
                this._crossword.grid[id].isBlackTile = true;
                if (!this.isValidBlackTile(id)) {
                    this._crossword.grid[id].isBlackTile = false;
                }
            }
            tileCount++;
            complexity = this.getComplexity();
        } while (complexity > COMPLEXITY_THRESHOLD && tileCount < this._crossword.grid.length);
    }

    private generateDefaultBlackTiles(): void {
        for (const tile of DEFAULT_BLACK_TILES) {
            this._crossword.grid[this._crossword.getPosition(tile["0"], tile["1"])].isBlackTile = true;
        }
    }

    private isValidBlackTile(id: number): boolean {
        if (id <= this._crossword.size || id % this._crossword.size === 0) {
            return false;
        }

        const acrossLetter: Letter[] = new Array<Letter>();
        const downLetters: Letter[] = new Array<Letter>();
        const blackTileRow: number = this._crossword.getRow(id);
        const blackTileColumn: number = this._crossword.getColumn(id);
        for (let i: number = 0; i < this._crossword.size; i++) {
            acrossLetter.push(this._crossword.grid[this._crossword.getPosition(blackTileRow, i)]);
            downLetters.push(this._crossword.grid[this._crossword.getPosition(i, blackTileColumn)]);
        }

        return this.getNumberOfWordsInLine(acrossLetter) > 0 &&
            this.getNumberOfWordsInLine(downLetters) > 0;
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

    private getComplexity(): number {
        let complexity: number = 0;
        let horizontalComplexity: number = 0;
        let verticalComplexity: number = 0;
        for (let i: number = 0; i < this._crossword.size; i++) {
            for (let j: number = 0; j < this._crossword.size; j++) {
                if (!this._crossword.grid[this._crossword.getPosition(i, j)].isBlackTile) {
                    if (this.isInAWord(this._crossword.getPosition(i, j), Orientation.Across) &&
                        this.isInAWord(this._crossword.getPosition(i, j), Orientation.Down)) {
                        complexity += ++horizontalComplexity;
                    }
                } else {
                    horizontalComplexity = 0;
                    verticalComplexity = 0;
                }

                if (!this._crossword.grid[this._crossword.getPosition(j, i)].isBlackTile) {
                    if (this.isInAWord(this._crossword.getPosition(j, i), Orientation.Across) &&
                        this.isInAWord(this._crossword.getPosition(j, i), Orientation.Down)) {
                        complexity += ++verticalComplexity;
                    }

                } else {
                    horizontalComplexity = 0;
                    verticalComplexity = 0;
                }
            }
        }

        return complexity;
    }

    private isInAWord(tileId: number, orientation: Orientation): boolean {
        const increment: number = orientation === Orientation.Across ? 1 : this._crossword.size;

        if (!(orientation === Orientation.Across &&
            this._crossword.getColumn(tileId) === this._crossword.size - 1)) { // The first if is to prevent overflow to next row
            if (tileId + increment < this._crossword.grid.length &&
                !this._crossword.grid[tileId + increment].isBlackTile) {
                return true;
            }
        }
        if (!(orientation === Orientation.Across &&
            this._crossword.getColumn(tileId) === 0)) { // The first if is to prevent underflow to previous row
            if (tileId - increment >= 0 && !this._crossword.grid[tileId - increment].isBlackTile) {
                return true;
            }
        }

        return false;
    }

}
