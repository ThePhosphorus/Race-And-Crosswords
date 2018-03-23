import { Injectable } from "@angular/core";
import { Difficulty, CrosswordGrid, Orientation, Word, Letter } from "../../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { GameManager, EMPTY_TILE_CHARACTER, SolvedWord } from "../crossword-game-manager/crossword-game-manager";
import { GridState } from "../grid-state/grid-state";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MOCK } from "../mock-crossword/mock-crossword";
import { Player, PlayerId } from "../../../../../common/communication/Player";

// Put true tu use mock grid instead of generated one
const USE_MOCK_GRID: boolean = false;
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;

class OtherPlayersHover {
    public constructor(
        public playerId: PlayerId,
        public selectedLetters: Array<number>,
    ) { }
}

@Injectable()
export class CrosswordService {
    private _gameManager: GameManager;
    private _gridStateSubject: BehaviorSubject<GridState>;
    private _otherPlayersHover: Array<OtherPlayersHover>;

    public constructor(private commService: CrosswordCommunicationService) {
        this._gameManager = new GameManager();
        this._gridStateSubject = new BehaviorSubject<GridState>(new GridState());
        this._otherPlayersHover = new Array<OtherPlayersHover>();
        if (USE_MOCK_GRID) {
            this._gameManager.grid = MOCK;
        }
    }

    public get currentPlayer(): BehaviorSubject<number> {
        return this._gameManager.currentPlayerObs;
    }

    public get difficulty(): BehaviorSubject<Difficulty> {
        return this._gameManager.difficultyObs;
    }

    public get solvedWords(): BehaviorSubject<SolvedWord[]> {
        return this._gameManager.solvedWordsObs;
    }

    public get gridStateObs(): BehaviorSubject<GridState> {
        return this._gridStateSubject;
    }

    public get playerGrid(): BehaviorSubject<CrosswordGrid> {
        return this._gameManager.playerGridObs;
    }

    public get solvedGrid(): BehaviorSubject<CrosswordGrid> {
        return this._gameManager.solvedGridObs;
    }

    public get players(): BehaviorSubject<Player[]> {
        return this._gameManager.playersObs;
    }

    public newGame(difficulty: Difficulty, isSinglePlayer: boolean): void {
        if (!USE_MOCK_GRID) {
            this._gameManager.newGame();
            this._gameManager.difficulty = difficulty;

            if (isSinglePlayer) {
                this.commService.getCrossword(difficulty, INITIAL_BLACK_TILES_RATIO, INITIAL_GRID_SIZE)
                    .subscribe((crosswordGrid: CrosswordGrid) => {
                        this._gameManager.grid = crosswordGrid;
                    });

                this._gameManager.players = [new Player(0, this.commService.returnName, 0)];
            } else {
                this.commService.listenerReceiveGrid = (grid: CrosswordGrid) =>
                    this._gameManager.grid = grid;
                this.commService.listenerReceivePlayers = (players: Player[]) => {
                    this._gameManager.players = players;
                    this._gameManager.currentPlayer = this.commService.returnName;
                };
                this.commService.listenerReceiveSelect = (playerId: number, letterId: number, orientation: Orientation) =>
                    this.selectWordFromOtherPlayer(playerId, letterId, orientation);
                this.commService.listenerReceiveUpdatedWord = (word: Word) =>
                    this.disableWord(word);
            }
        }
    }

    public setHoveredWord(word: Word): void {
        this._gridStateSubject.value.hoveredLetters = [];
        if (word != null) {
            for (const letter of word.letters) {
                this._gridStateSubject.value.hoveredLetters.push(letter.id);
            }
        }
        // this._gridStateSubject.next(this._gridState);
    }

    public setSelectedLetter(index: number): void {
        if (!this._gridStateSubject.value.LIsDisabled(index)) {
            if (this._gridStateSubject.value.LIsCurrentLetter(index)) {
                this._gridStateSubject.value.switchOrientation();
            } else {
                this._gridStateSubject.value.currentOrientation = Orientation.Across;
            }
            let targetWord: Word = this._gameManager.findWordFromLetter(
                index, this._gridStateSubject.value.currentOrientation, false);
            if (targetWord === null) {
                for (const ori of Object.keys(Orientation)) {
                    if (ori !== this._gridStateSubject.value.currentOrientation) {
                        this._gridStateSubject.value.currentOrientation = ori as Orientation;
                        targetWord = this._gameManager.findWordFromLetter(index, ori, false);
                        break;
                    }
                }
            }
            this.setSelectedWord(targetWord);
            this._gridStateSubject.value.currentLetter = targetWord.letters[0].id;
            if (this._gridStateSubject.value.LIsDisabled(this._gridStateSubject.value.currentLetter)) {
                this._gridStateSubject.value.currentLetter = this.findNextLetterId(true);
            }
            this.commService.notifySelect(index, this._gridStateSubject.value.currentOrientation);
        }
    }

    public setSelectedWord(word: Word): void {
        let startingIndex: number = null;
        for (const letter of word.letters) {
            if (!this._gridStateSubject.value.LIsDisabled(letter.id)) {
                startingIndex = letter.id;
                break;
            }
        }
        if (startingIndex != null) {
            this._gridStateSubject.value.currentOrientation = word.orientation;
            this._gridStateSubject.value.selectedLetters = [];
            for (const letter of word.letters) {
                this._gridStateSubject.value.selectedLetters.push(letter.id);
            }
            this._gridStateSubject.value.currentLetter = startingIndex;
        }
        // this._gridStateSubject.next(this._gridState);
    }

    public unselectWord(): void {
        this._gridStateSubject.value.currentLetter = null;
        this._gridStateSubject.value.selectedLetters = [];
        this._gridStateSubject.value.hoveredLetters = [];
        this._gridStateSubject.value.currentOrientation = Orientation.Across;
        // this._gridStateSubject.next(this._gridState);
    }

    private disableWord(word: Word): void {
        for (const orientation of Object.keys(Orientation)) {
            for (const letter of word.letters) {
                this._gridStateSubject.value.disabledLetters.push(letter.id);
                this._gameManager.setChar(letter.id, letter.char);
            }
            if (orientation === this._gridStateSubject.value.currentOrientation) {
                this.unselectWord();
                if (this._gameManager.addSolvedWord(word)) {
                    // show end game modal
                }
            }
        }
    }

    private verifyWords(): void {
        for (const orientation of Object.keys(Orientation)) {
            const playerWord: Word = this._gameManager.findWordFromLetter(this._gridStateSubject.value.currentLetter, orientation, false);
            const solvedWord: Word = this._gameManager.findWordFromLetter(this._gridStateSubject.value.currentLetter, orientation, true);
            if (playerWord != null) {
                if (playerWord.letters.map((lt: Letter) => (lt.char)).join("") ===
                    solvedWord.letters.map((lt: Letter) => (lt.char)).join("")) {
                    this.commService.completedWord(solvedWord);
                    this.commService.listenerIsCompletedFirst = (isFirst: boolean) => {
                        if (isFirst) {
                            this.disableWord(solvedWord);
                        }
                    };
                }
            }
        }
    }

    public writeChar(key: string): void {
        if (this._gridStateSubject.value.currentLetter != null) {
            if (key.match(/^[a-zA-z]$/i) != null) {
                let nextLetterId: number;
                this._gameManager.setChar(this._gridStateSubject.value.currentLetter, key.toLowerCase());
                this.verifyWords();
                nextLetterId = this.findNextLetterId(true);
                if (nextLetterId != null) {
                    this._gridStateSubject.value.currentLetter = nextLetterId;
                }
            } else if (key === "Backspace") {
                let nextLetterId: number;
                if (this._gameManager.getChar(this._gridStateSubject.value.currentLetter) === EMPTY_TILE_CHARACTER) {
                    nextLetterId = this.findNextLetterId(false);
                    if (nextLetterId != null) {
                        this._gridStateSubject.value.currentLetter = nextLetterId;
                    }
                }
                this._gameManager.setChar(this._gridStateSubject.value.currentLetter, EMPTY_TILE_CHARACTER);
            }
        }
    }

    private findNextLetterId(isForward: boolean): number {
        if (isForward) {
            for (let i: number = this._gridStateSubject.value.selectedLetters.indexOf(this._gridStateSubject.value.currentLetter) + 1;
                i < this._gridStateSubject.value.selectedLetters.length; i++) {
                if (!this._gridStateSubject.value.LIsDisabled(this._gridStateSubject.value.selectedLetters[i])) {
                    return this._gridStateSubject.value.selectedLetters[i];
                }
            }
        } else {
            for (let i: number = this._gridStateSubject.value.selectedLetters
                .indexOf(this._gridStateSubject.value.currentLetter) - 1; i >= 0; i--) {
                if (!this._gridStateSubject.value.LIsDisabled(this._gridStateSubject.value.selectedLetters[i])) {
                    return this._gridStateSubject.value.selectedLetters[i];
                }
            }
        }

        return null;
    }

    public getLetterHighlightPlayer(letterId: number): PlayerId {
        let player: PlayerId = null;
        if (this._gridStateSubject.getValue().LIsHighlighted(letterId)) {
            player = this._gameManager.currentPlayerObs.getValue();
        } else {
            this._otherPlayersHover.forEach((oph: OtherPlayersHover) => {
                if (oph.selectedLetters.indexOf(letterId) > -1) {
                    player = oph.playerId;
                }
            });
        }

        return player;
    }

    public selectWordFromOtherPlayer(playerId: PlayerId, letterId: number, orientation: Orientation): void {
        let player: OtherPlayersHover = this._otherPlayersHover.find((oph: OtherPlayersHover) => oph.playerId === playerId);

        if (player == null) {
            player = new OtherPlayersHover(playerId, []);
            this._otherPlayersHover.push(player);
        }

        const word: Word = this._gameManager.findWordFromLetter(letterId, orientation, true);

        if (word != null) {
            player.selectedLetters = word.letters.map(
                (letter: Letter) => letter.id
            );
        }
    }

    public getColorFromPlayer(playerId: PlayerId, isFrontGround: boolean): string {
        return this._gameManager.getColorFromPlayer(playerId, isFrontGround);
    }
}
