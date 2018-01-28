import { Word, Orientation, Position } from "./word";

class GenerateurGrille {

    private gridSize: number = 10;
    private blackTilePercentage: number = 0.2;
    // private words: Word[];
    private blackTiles: Position[];
    private wordPlacement: [boolean, number, number][];
    private verticalWords: Word[][];
    private horizontalWords: Word[][];

    public GenerateurGrille(): void {
        this.verticalWords = [];
        this.horizontalWords = [];
        for (let i: number = 0; i < this.gridSize; i++) {
            this.verticalWords.push([]);
            this.horizontalWords.push([]);
        }
    }

    public generateEmptyGrid(): void {
        this.generateBlackTiles();
        this.generateEmptyWords();
    }

    private generateBlackTiles(): void {
        const numberOfBlackTile: number = this.gridSize * this.gridSize * this.blackTilePercentage;
        for (let i: number = 0; i < numberOfBlackTile; i++) {
            const newTile: Position = new Position();
            newTile.column = Math.floor (Math.random() * (this.gridSize - 2)) + 1;
            newTile.row = Math.floor (Math.random() * (this.gridSize - 2)) + 1;
            this.blackTiles[i] = newTile;
        }
    }

    private generateEmptyWords(): void {
        this.blackTiles.forEach((blackTile: Position) => {
            this.verticalWords[blackTile.column].push(new Word());

        });
    }

    public getWord(): void {

    }

    public getConstraints(): void {

    }
}
