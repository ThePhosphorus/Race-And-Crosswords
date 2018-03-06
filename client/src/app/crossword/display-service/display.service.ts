import { Injectable } from "@angular/core";
import { Word, Orientation } from "../../../../../common/communication/crossword-grid";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

export class GridState {
    public currentOrientation: Orientation;
    public currentLetter: number;
    public highlightedLetters: number[];
    public hoveredLetters: number[];
    public disabledLetters: number[];
    public currentPlayer: number;

    public constructor() {
        this.currentLetter = null;
        this.highlightedLetters = [];
        this.hoveredLetters = [];
        this.disabledLetters = [];
        this.currentOrientation = Orientation.Across;
        this.currentPlayer = 1;
    }
}

@Injectable()
export class DisplayService {
    private _gridState: GridState;
    private _gridStateSubject: Subject<GridState>;

    public constructor() {
        this._gridState = new GridState;
        this._gridStateSubject = new Subject<GridState>;
    }

    public get gridState(): Observable<GridState> {
        return this._gridStateSubject.asObservable();
    }

    public setHoveredWord(word: Word): void {
        this._gridState.hoveredLetters = [];
        if (word != null) {
            for (const letter of word.letters) {
                this._gridState.hoveredLetters.push(letter.id);
            }
        }
        this._gridStateSubject.next(this._gridState);
    }

    public setSelectedWord(word: Word): void {
        let startingIndex: number = null;
        for (const letter of word.letters) {
            if (this._gridState.disabledLetters.indexOf(letter.id) === -1) {
                startingIndex = letter.id;
                break;
            }
        }
        if (startingIndex != null) {
            this._gridState.currentOrientation = word.orientation;
            this._gridState.highlightedLetters = [];
            for (const letter of word.letters) {
                this._gridState.highlightedLetters.push(letter.id);
            }
            this._gridState.currentLetter = startingIndex;
        }
        this._gridStateSubject.next(this._gridState);
    }

    public unselectWord(): void {
        this._gridState.currentLetter = null;
        this._gridState.highlightedLetters = [];
        this._gridState.hoveredLetters = [];
        this._gridState.currentOrientation = Orientation.Across;
        this._gridStateSubject.next(this._gridState);
    }
}
