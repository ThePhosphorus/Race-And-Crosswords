import { Word, Orientation, Position } from "./word";

class GenerateurGrille {

    private gridSize: number = 10;
    private blackTilePercentage: number = 0.2;
    // private words: Word[];
    private blackTiles: Position[];
    private wordPlacement: [boolean, number, number][];

    public generateEmptyGrid(): void {
        this.generateBlackTiles();
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

    public getWord(): void {

    }

    public getConstraints(): void {

    }
}
