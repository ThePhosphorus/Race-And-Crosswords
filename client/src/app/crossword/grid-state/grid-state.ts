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

    public LIsDisabled(letterId: number): boolean {
        return this.disabledLetters.indexOf(letterId) > -1;
    }

    public LIsHovered(letterId: number): boolean {
        return this.hoveredLetters.indexOf(letterId) > -1;
    }

    public LIsHighlighted(letterId: number): boolean {
        return this.selectedLetters.indexOf(letterId) > -1;
    }

    public LIsCurrentLetter(letterId: number): boolean {
        return this.currentLetter === letterId;
    }
}
