import { Orientation } from "../../../../../common/crossword/enums-constants";

export class GridState {
    public currentOrientation: Orientation;
    public currentLetter: number;
    public selectedLetters: number[];
    public hoveredLetters: number[];
    public disabledLetters: number[];

    public constructor() {
        this.currentOrientation = Orientation.Across;
        this.currentLetter = null;
        this.selectedLetters = [];
        this.hoveredLetters = [];
        this.disabledLetters = [];
    }

    public isLetterDisabled(letterId: number): boolean {
        return this.disabledLetters.indexOf(letterId) > -1;
    }

    public isLetterHovered(letterId: number): boolean {
        return this.hoveredLetters.indexOf(letterId) > -1;
    }

    public isLetterSelected(letterId: number): boolean {
        return this.selectedLetters.indexOf(letterId) > -1;
    }

    public isLetterCurrent(letterId: number): boolean {
        return this.currentLetter === letterId;
    }

    public isCurrentOrientation(orientation: Orientation): boolean {
        return orientation === this.currentOrientation;
    }

    public switchOrientation(): void {
        this.currentOrientation = this.currentOrientation === Orientation.Down ?
            Orientation.Across : Orientation.Down;
    }

    public unselect(): void {
        this.currentLetter = null;
        this.selectedLetters = [];
        this.hoveredLetters = [];
        this.currentOrientation = Orientation.Across;
    }
}
