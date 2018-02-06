import { CrosswordGrid, Letter, MIN_WORD_LENGTH } from "../../../../../common/communication/crossword-grid";

export class EmptyGridFactory {

    private crossword: CrosswordGrid;

    public constructor(private size: number, private blackTileRatio: number) {}

    public getNewGrid(): CrosswordGrid {
        this.crossword = new CrosswordGrid();
        this.initializeGrid(this.size);
        this.generateBlackTiles(this.blackTileRatio);

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
            if (this.isCorrectBlackTile(id) ) {
                this.crossword.grid[id].isBlackTile = true;
                if (this.isValidBlackTile(id)) {
                    generatedBlackTiles++;
                } else {
                    this.crossword.grid[id].isBlackTile = false;
                }

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

}
