import { Letter, MIN_WORD_LENGTH, Orientation } from "../../../../../common/communication/crossword-grid";
import { ExtendedCrosswordGrid } from "../extendedCrosswordGrid/extended-crossword-grid";

const COMPLEXITY_THRESHOLD: number = 80;

export class EmptyGridFactory {

    private crossword: ExtendedCrosswordGrid;

    public constructor(private size: number, private blackTileRatio: number) { }

    public getNewGrid(): ExtendedCrosswordGrid {
        let complexity: number;
        do {
            this.crossword = new ExtendedCrosswordGrid();
            this.initializeGrid(this.size);
            this.generateBlackTiles(this.blackTileRatio);
            complexity = this.getComplexity();
        } while (complexity > COMPLEXITY_THRESHOLD);

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
        let complexity: number;
        let tileCount: number = 0;
        do {
            const id: number = Math.floor(Math.random() * (this.crossword.size * this.crossword.size));
            if (this.isCorrectBlackTile(id)) {
                this.crossword.grid[id].isBlackTile = true;
                tileCount++;
                if (!this.isValidBlackTile(id)) {
                    this.crossword.grid[id].isBlackTile = false;
                }
            }
            complexity = this.getComplexity();
            console.log(complexity);
        } while (complexity > COMPLEXITY_THRESHOLD && tileCount < this.crossword.grid.length);
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

    private getComplexity(): number {
        let complexity: number = 0;
        let horizontalComplexity: number = 0;
        let verticalComplexity: number = 0;
        for (let i: number = 0; i < this.crossword.size; i++) {
            for (let j: number = 0; j < this.crossword.size; j++) {
                if (!this.crossword.grid[(this.size * i) + j].isBlackTile) {
                    if (this.isInAWord((this.size * i) + j, Orientation.Across) &&
                        this.isInAWord((this.size * i) + j, Orientation.Down)) {
                        complexity += ++horizontalComplexity;
                    }
                } else {
                    horizontalComplexity = 0;
                    verticalComplexity = 0;
                }

                if (!this.crossword.grid[(this.size * i) + j].isBlackTile) {
                    if (this.isInAWord((this.size * j) + i, Orientation.Across) &&
                        this.isInAWord((this.size * j) + i, Orientation.Down)) {
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
        const increment: number = orientation === Orientation.Across ? 1 : this.crossword.size;

        if (!(orientation === Orientation.Across &&
            this.crossword.getColumn[tileId] === this.crossword.size - 1)) { // The first if is to prevent overflow to next row
            if (tileId + increment < this.crossword.grid.length &&
                !this.crossword.grid[tileId + increment].isBlackTile) {
                return true;
            }
        }
        if (!(orientation === Orientation.Across &&
            this.crossword.getColumn[tileId] === 0)) { // The first if is to prevent underflow to previous row
            if (tileId - increment >= 0 && !this.crossword.grid[tileId - increment].isBlackTile) {
                return true;
            }
        }

        return false;
    }

}
