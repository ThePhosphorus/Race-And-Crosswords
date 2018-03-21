import { Injectable } from "@angular/core";
import { Difficulty, CrosswordGrid, Orientation, Word, Letter } from "../../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { GameManager, EMPTY_TILE_CHARACTER } from "../crossword-game-manager/crossword-game-manager";
import { GridState } from "../grid-state/grid-state";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { of } from "rxjs/observable/of";
import { MOCK } from "../mock-crossword/mock-crossword";

// Put true tu use mock grid instead of generated one
const USE_MOCK_GRID: boolean = false;
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;

@Injectable()
export class CrosswordService {
    private _gameManager: GameManager;
    private _gridState: GridState;
    private _gridStateSubject: BehaviorSubject<GridState>;

    public constructor(private commService: CrosswordCommunicationService) {
        this._gameManager = new GameManager();
        this._gridState = new GridState();
        this._gridStateSubject = new BehaviorSubject<GridState>(this._gridState);
    }

    public get currentPlayer(): Observable<number> {
        return this._gameManager.currentPlayerObs;
    }

    public get difficulty(): Observable<Difficulty> {
        return this._gameManager.difficultyObs;
    }

    public get solvedWords(): Observable<number[]> {
        return this._gameManager.solvedWordsObs;
    }

    public get gridStateObs(): Observable<GridState> {
        return this._gridStateSubject.asObservable();
    }

    public get grid(): Observable<CrosswordGrid> {
        return USE_MOCK_GRID ? of(MOCK) : this._gameManager.gridObs;
    }

    public newGame(difficulty: Difficulty, isSinglePlayer: boolean ): Observable<CrosswordGrid> {
        if (!USE_MOCK_GRID) {
            this._gameManager.newGame();
            this._gameManager.difficulty = difficulty;
            if (isSinglePlayer) {
                this.commService.getCrossword(difficulty, INITIAL_BLACK_TILES_RATIO, INITIAL_GRID_SIZE)
                .subscribe((crosswordGrid: CrosswordGrid) => {
                    this._gameManager.grid = crosswordGrid;
                });
            } else {
                this.commService.listenerReceiveGrid((grid: CrosswordGrid) => this._gameManager.grid = grid);
            }
        }

        return this.grid;
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

    public setSelectedLetter(index: number): void {
        if (!this._gridState.LIsDisabled(index)) {
            if (this._gridState.LIsCurrentLetter(index)) {
                this._gridState.switchOrientation();
            } else {
                this._gridState.currentOrientation = Orientation.Across;
            }
            let targetWord: Word;
            if ((targetWord = this._gameManager.findWordFromLetter(index, this._gridState.currentOrientation, false)) === null) {
                for (const ori of Object.keys(Orientation)) {
                    if (ori !== this._gridState.currentOrientation) {
                        this._gridState.currentOrientation = ori as Orientation;
                        targetWord = this._gameManager.findWordFromLetter(index, ori, false);
                        break;
                    }
                }
            }
            this.setSelectedWord(targetWord);
            this._gridState.currentLetter = targetWord.letters[0].id;
            if (this._gridState.LIsDisabled(this._gridState.currentLetter)) {
                this._gridState.currentLetter = this.findNextLetterId(true);
            }
        }
    }

    public setSelectedWord(word: Word): void {
        let startingIndex: number = null;
        for (const letter of word.letters) {
            if (!this._gridState.LIsDisabled(letter.id)) {
                startingIndex = letter.id;
                break;
            }
        }
        if (startingIndex != null) {
            this._gridState.currentOrientation = word.orientation;
            this._gridState.selectedLetters = [];
            for (const letter of word.letters) {
                this._gridState.selectedLetters.push(letter.id);
            }
            this._gridState.currentLetter = startingIndex;
        }
        this._gridStateSubject.next(this._gridState);
    }

    public unselectWord(): void {
        this._gridState.currentLetter = null;
        this._gridState.selectedLetters = [];
        this._gridState.hoveredLetters = [];
        this._gridState.currentOrientation = Orientation.Across;
        this._gridStateSubject.next(this._gridState);
    }

    private verifyWords(): void {
        for (const orientation of Object.keys(Orientation)) {
            const playerWord: Word = this._gameManager.findWordFromLetter(this._gridState.currentLetter, orientation, false);
            const solvedWord: Word = this._gameManager.findWordFromLetter(this._gridState.currentLetter, orientation, true);
            if (playerWord != null) {
                if (playerWord.letters.map((lt: Letter) => (lt.char)).join("") ===
                    solvedWord.letters.map((lt: Letter) => (lt.char)).join("")) {
                    for (const letter of playerWord.letters) {
                        this._gridState.disabledLetters.push(letter.id);
                    }
                    if (orientation === this._gridState.currentOrientation) {
                        this.unselectWord();
                        this._gameManager.addSolvedWord(playerWord);
                    }
                }
            }
        }
    }

    public writeChar(key: string): void {
        if (this._gridState.currentLetter != null) {
            if (key.match(/^[a-zA-z]$/i) != null) {
                let nextLetterId: number;
                this._gameManager.setChar(this._gridState.currentLetter, key.toLowerCase());
                this.verifyWords();
                nextLetterId = this.findNextLetterId(true);
                if (nextLetterId != null) {
                    this._gridState.currentLetter = nextLetterId;
                }
            } else if (key === "Backspace") {
                let nextLetterId: number;
                if (this._gameManager.getChar(this._gridState.currentLetter) === EMPTY_TILE_CHARACTER) {
                    nextLetterId = this.findNextLetterId(false);
                    if (nextLetterId != null) {
                        this._gridState.currentLetter = nextLetterId;
                    }
                }
                this._gameManager.setChar(this._gridState.currentLetter, EMPTY_TILE_CHARACTER);
            }
        }
    }

    private findNextLetterId(isForward: boolean): number {
        if (isForward) {
            for (let i: number = this._gridState.selectedLetters.indexOf(this._gridState.currentLetter) + 1;
                                                        i < this._gridState.selectedLetters.length; i++) {
                if (!this._gridState.LIsDisabled(this._gridState.selectedLetters[i])) {
                    return this._gridState.selectedLetters[i];
                }
            }
        } else {
            for (let i: number = this._gridState.selectedLetters.indexOf(this._gridState.currentLetter) - 1; i >= 0; i--) {
                if (!this._gridState.LIsDisabled(this._gridState.selectedLetters[i])) {
                    return this._gridState.selectedLetters[i];
                }
            }
        }

        return null;
    }
}
