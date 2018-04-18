import { Orientation } from "../../../../../common/crossword/enums-constants";
import { Word } from "../../../../../common/crossword/word";

export interface OtherPlayersSelect {
    playerId: number;
    selectedLetters: Array<number>;
}

export class GridState {
    public currentOrientation: Orientation;
    public currentLetter: number;
    public selectedLetters: number[];
    public hoveredLetters: number[];
    public disabledLetters: number[];
    public otherPlayersSelect: Array<OtherPlayersSelect>;

    public constructor() {
        this.currentOrientation = Orientation.Across;
        this.currentLetter = null;
        this.selectedLetters = [];
        this.hoveredLetters = [];
        this.disabledLetters = [];
        this.otherPlayersSelect = new Array<OtherPlayersSelect>();
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

    public setHoveredWord(word: Word): void {
        this.hoveredLetters = [];
        if (word != null) {
            for (const letter of word.letters) {
                this.hoveredLetters.push(letter.id);
            }
        }
    }

    public setSelectedWord(word: Word): boolean {
        let startingIndex: number = null;
        for (const letter of word.letters) {
            if (!this.isLetterDisabled(letter.id)) {
                startingIndex = letter.id;
                break;
            }
        }

        if (startingIndex != null) {
            this.currentOrientation = word.orientation;
            this.selectedLetters = [];
            for (const letter of word.letters) {
                this.selectedLetters.push(letter.id);
            }
            this.currentLetter = startingIndex;
        }

        return startingIndex != null;
    }

    public unselect(): void {
        this.currentLetter = null;
        this.selectedLetters = [];
        this.hoveredLetters = [];
        this.currentOrientation = Orientation.Across;
    }

    public goToNextLetter(isForward: boolean): void {
        let nextLetterId: number = null;
        if (isForward) {
            for (let i: number = this.selectedLetters
                .indexOf(this.currentLetter) + 1;
                i < this.selectedLetters.length; i++) {
                if (!this.isLetterDisabled(this.selectedLetters[i])) {
                    nextLetterId =  this.selectedLetters[i];
                    break;
                }
            }
        } else {
            for (let i: number = this.selectedLetters
                .indexOf(this.currentLetter) - 1; i >= 0; i--) {
                if (!this.isLetterDisabled(this.selectedLetters[i])) {
                    nextLetterId = this.selectedLetters[i];
                    break;
                }
            }
        }

        if (nextLetterId != null) {
            this.currentLetter = nextLetterId;
        }
    }
}
