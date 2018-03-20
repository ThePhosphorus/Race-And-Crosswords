import { Orientation } from "../../../../../common/communication/crossword-grid";

export class GridState {
    public currentOrientation: Orientation;
    public currentLetter: number;
    public selectedLetters: number[];
    public hoveredLetters: number[];
    public disabledLetters: number[];
    public currentPlayer: number;

    public constructor() {
        this.currentOrientation = Orientation.Across;
        this.currentLetter = null;
        this.selectedLetters = [];
        this.hoveredLetters = [];
        this.disabledLetters = [];
        this.currentPlayer = 1;
    }
}
