import { Word } from "./word";
import { Letter } from "./letter";

export class CrosswordGrid {
    public words: Word[];
    public grid: Letter[];
    public size: number;

    constructor() {
        this.words = new Array<Word>();
        this.grid = new Array<Letter>();
        this.size = 0;
    }
}
