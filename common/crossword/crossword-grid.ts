import { ICrosswordGrid } from "./I-crossword-grid";

export class CrosswordGrid extends ICrosswordGrid {

    public getRow(position: number): number {
        return Math.floor( position / this.size);
    }

    public getColumn(position: number): number {
        return position % this.size;
    }

    public getPosition(row: number, column: number): number {
        return row * this.size + column;
    }
}
