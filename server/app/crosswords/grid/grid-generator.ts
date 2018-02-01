import { Word, Orientation, Position } from "./word";
import { Request } from "express-serve-static-core";

const MIN_WORD_LENGTH: number = 2;

export enum Difficulty {
    Easy= "Easy",
    Medium= "Medium",
    Hard= "Hard",
}

export class GridGenerator {

    private gridSize: number = 10;
    private blackTilePercentage: number = 0.2;
    // private words: Word[];
    private blackTiles: Position[];
    private wordPlacement: [boolean, number, number][]; // Maybe we should make this into a class or struct
    private verticalWords: Word[][];
    private horizontalWords: Word[][];

    public getNewGrid(difficulty: Difficulty ): any {
        let rep: JSON;

        return {
            blackTiles: this.blackTiles,
        };
    }

    private generateGrid(): void {
        this.verticalWords = [];
        this.horizontalWords = [];
        for (let i: number = 0; i < this.gridSize; i++) {
            this.verticalWords.push([]);
            this.horizontalWords.push([]);
        }
        this.generateEmptyGrid();
    }

    public generateEmptyGrid(): void {
        this.generateBlackTiles();
        this.generateEmptyWords();
    }

    private generateBlackTiles(): void {
        const numberOfBlackTile: number = this.gridSize * this.gridSize * this.blackTilePercentage;
        for (let i: number = 0; i < numberOfBlackTile; i++) {
            const column: number = Math.floor (Math.random() * (this.gridSize - MIN_WORD_LENGTH)) + 1;
            const row: number = Math.floor (Math.random() * (this.gridSize - MIN_WORD_LENGTH)) + 1;
            this.blackTiles[i] = new Position(column, row);
        }
    }

    private generateEmptyWords(): void {
        this.blackTiles.forEach((blackTile: Position) => {
            if (blackTile.column >= MIN_WORD_LENGTH) {
                this.horizontalWords[blackTile.row].push(
                    new Word(Orientation.Horizontal,
                             new Position(0, blackTile.row),
                             blackTile.column));
            }
            if (blackTile.column <= this.gridSize - MIN_WORD_LENGTH - 1) {
                this.horizontalWords[blackTile.row].push(
                    new Word(Orientation.Horizontal,
                             new Position(blackTile.column + 1, blackTile.row),
                             this.gridSize - blackTile.column + 1));
            }
            if (blackTile.row >= MIN_WORD_LENGTH) {
                this.verticalWords[blackTile.column].push(
                    new Word(Orientation.Vertical,
                             new Position(blackTile.column, 0),
                             blackTile.row));
            }
            if (blackTile.row <= this.gridSize - MIN_WORD_LENGTH - 1) {
                this.verticalWords[blackTile.column].push(
                    new Word(Orientation.Vertical,
                             new Position(blackTile.column, blackTile.row + 1),
                             this.gridSize - blackTile.row + 1));
            }
        });
    }

    public populateGrid(): void {
        for (let index: number = 0; index < this.verticalWords.length; index++) {
            this.verticalWords[index].forEach((word: Word) => {
                this.wordPlacement.push([true, index, word.length]);
            });
        }
        for (let index: number = 0; index < this.verticalWords.length; index++) {
            this.verticalWords[index].forEach((word: Word) => {
                this.wordPlacement.push([true, index, word.length]);
            });
        }
        this.wordPlacement.sort((w1, w2) => w1[2] - w2[2]);

        this.addWordToGrid(0);
    }

    private addWordToGrid(index: number): boolean {
        return true;
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
                callback([]);
            });
    }

    private getWords(): void {
        
    }

    private getConstraints(): void {

    }
}
