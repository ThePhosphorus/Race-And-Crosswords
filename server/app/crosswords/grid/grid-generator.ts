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
    private wordPlacement: [Orientation, Position, number][]; // Maybe we should make this into a class or struct
    private grid: CrosswordGrid;

    public getNewGrid(difficulty: Difficulty ): {} {
        let rep: JSON;

        return {
            blackTiles: this.grid.blackTiles,
        };
    }

    private generateGrid(): void {
        this.generateEmptyGrid();
    }

    public generateEmptyGrid(): void {
        this.grid.down = [];
        this.grid.across = [];
        for (let i: number = 0; i < this.gridSize; i++) {
            this.grid.down.push([]);
            this.grid.across.push([]);
        }

        this.generateBlackTiles();
        this.generateAllEmptyWords();
        this.populateWordLists();

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

        this.wordPlacement.sort((word1, word2) => word1[2] - word2[2]);

        this.addWordToGrid(0);
    }

    private populateWordList(orientation: Orientation): void {
        let words: Word[][];
        orientation === Orientation.Horizontal ?
        words = this.grid.down :
        words = this.grid.across;

        words.forEach((colomn: Word[]) => {
            colomn.forEach((word: Word) => {
                this.wordPlacement.push([orientation,
                                         word.position,
                                         word.length]);
            });
        });

    }

    private addWordToGrid(index: number): boolean {
        let currentWord: Word;
        this.wordPlacement[index][0] === Orientation.Vertical ? // Aller chercher currentWord dans wordPlacement
            currentWord = this.grid.down[index] :
            currentWord = this.grid.across[index];

        this.getConstrainedWords(this.getWordConstraints(currentWord), this.placeWord);

        return false;
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
                callback([]);
            });
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

    private placeWord(wordList: Word[]): void {
        wordList.forEach((word: Word) => {
            // Parcourir la liste de mots et ajouter celui qui marche a la grille

        });
    }

    private cleanWord(word: Word): Word {
        return word;
    }

    private getWordConstraints(word: Word): string {
        return "";
    }

    private getConstraints(): void {

    }
}
