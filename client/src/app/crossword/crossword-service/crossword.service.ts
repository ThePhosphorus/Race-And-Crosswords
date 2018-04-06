import { Injectable } from "@angular/core";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { GameManager, EMPTY_TILE_CHARACTER, SolvedWord } from "../crossword-game-manager/crossword-game-manager";
import { GridState, OtherPlayersSelect } from "../grid-state/grid-state";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MOCK } from "../mock-crossword/mock-crossword";
import { Player } from "../../../../../common/communication/Player";
import { Difficulty, Orientation } from "../../../../../common/crossword/enums-constants";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Word } from "../../../../../common/crossword/word";
import { Letter } from "../../../../../common/crossword/letter";
// Put true tu use mock grid instead of generated one
const USE_MOCK_GRID: boolean = false;
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;
const INPUT_REGEX: RegExp = /^[a-z]$/i;

@Injectable()
export class CrosswordService {
    private _gameManager: GameManager;
    private _gridState: BehaviorSubject<GridState>;
    private _isSinglePlayer: boolean;
    private _isGameOver: BehaviorSubject<boolean>;

    public constructor(private commService: CrosswordCommunicationService) {
        this._gameManager = new GameManager();
        this._gridState = new BehaviorSubject<GridState>(new GridState());
        this._isSinglePlayer = true;
        this._isGameOver = new BehaviorSubject<boolean>(false);
        if (USE_MOCK_GRID) {
            this._gameManager.grid = MOCK;
        }
    }

    public get gameManager(): GameManager {
        return this._gameManager;
    }

    public get isTopPlayer(): boolean {
        return this._gameManager.topPlayer === this._gameManager.myPlayer;
    }

    public get isSinglePlayer(): boolean {
        return this._isSinglePlayer;
    }

    public get gridStateObs(): BehaviorSubject<GridState> {
        return this._gridState;
    }

    public get isGameOver(): BehaviorSubject<boolean> {
        return this._isGameOver;
    }

    public setIsGameOver(bool: boolean): void {
        this._isGameOver.next(bool);
    }

    public getPlayerColor(playerId: number, isFrontGround: boolean): string {
        return this._gameManager.getColorFromPlayer(playerId, isFrontGround);
    }

    public newGame(difficulty: Difficulty, isSinglePlayer: boolean): void {
        if (!USE_MOCK_GRID) {
            this._isSinglePlayer = isSinglePlayer;
            this._gameManager.newGame(difficulty);
            this.setIsGameOver(false);
            this._gridState.next(new GridState());

            if (isSinglePlayer) {
                this.setUpSingleplayer(difficulty);
            } else {
                this.setUpMultiplayer(difficulty);
            }
        }
    }

    public setHoveredWord(letterId: number, orientation: Orientation): void {
        this._gridState.value.hoveredLetters = [];

        if (letterId != null && orientation != null) {
            const word: Word = this._gameManager.findWordFromLetter(letterId, orientation, true);

            if (word != null) {
                for (const letter of word.letters) {
                    this._gridState.value.hoveredLetters.push(letter.id);
                }
            }
        }
    }

    public setSelectedLetter(index: number): void {
        if (!this._gridState.value.isLetterDisabled(index)) {
            if (this._gridState.value.isLetterCurrent(index)) {
                this._gridState.value.switchOrientation();
            } else {
                this._gridState.value.currentOrientation = Orientation.Across;
            }

            let targetWord: Word = this._gameManager.findWordFromLetter(
                index, this._gridState.value.currentOrientation, false);

            if (targetWord === null) {
                for (const ori of Object.keys(Orientation)) {
                    if (ori !== this._gridState.value.currentOrientation) {
                        this._gridState.value.currentOrientation = ori as Orientation;
                        targetWord = this._gameManager.findWordFromLetter(index, ori, false);
                        break;
                    }
                }
            }

            if (targetWord !== null) {
                this.setSelectedWord(targetWord.id, targetWord.orientation);
                this._gridState.value.currentLetter = targetWord.letters[0].id;
                if (this._gridState.value.isLetterDisabled(this._gridState.value.currentLetter)) {
                    this._gridState.value.currentLetter = this.findNextLetterId(true);
                }
            }
        }
    }

    public setSelectedWord(letterId: number, orientation: Orientation): void {
        let startingIndex: number = null;
        const word: Word = this._gameManager.findWordFromLetter(letterId, orientation, false);

        for (const letter of word.letters) {
            if (!this._gridState.value.isLetterDisabled(letter.id)) {
                startingIndex = letter.id;
                break;
            }
        }

        if (startingIndex != null) {
            this._gridState.value.currentOrientation = orientation;
            this._gridState.value.selectedLetters = [];

            for (const letter of word.letters) {
                this._gridState.value.selectedLetters.push(letter.id);
            }

            this._gridState.value.currentLetter = startingIndex;
            this.commService.notifySelect(letterId, orientation);
        }
    }

    public unselectWord(): void {
        this._gridState.getValue().unselect();
    }

    public writeChar(key: string): void {
        if (this._gridState.value.currentLetter != null) {
            if (key.match(INPUT_REGEX) != null) {
                let nextLetterId: number;
                this._gameManager.setChar(this._gridState.value.currentLetter, key.toLowerCase());
                this.verifyWords();
                nextLetterId = this.findNextLetterId(true);

                if (nextLetterId != null) {
                    this._gridState.value.currentLetter = nextLetterId;
                }
            } else if (key === "Backspace") {
                let nextLetterId: number;

                if (this._gameManager.getChar(this._gridState.value.currentLetter) === EMPTY_TILE_CHARACTER) {
                    nextLetterId = this.findNextLetterId(false);
                    if (nextLetterId != null) {
                        this._gridState.value.currentLetter = nextLetterId;
                    }
                }

                this._gameManager.setChar(this._gridState.value.currentLetter, EMPTY_TILE_CHARACTER);
            }
        }
    }

    public playersSelectingLetter(letterId: number): Array<number> {
        const players: Array<number> = new Array<number>();
        if (this._gridState.getValue().isLetterSelected(letterId)) {
            players.push(this._gameManager.myPlayer.id);
        }

        this._gridState.getValue().otherPlayersSelect.forEach((oph: OtherPlayersSelect) => {
            if (oph.selectedLetters.indexOf(letterId) > -1) {
                players.push(oph.playerId);
            }
        });

        return players;
    }

    public playersDisablingLetter(letterId: number): Array<number> {
        const players: Array<number> = new Array<number>();

        this._gameManager.solvedWordsSubject.getValue().forEach((sw: SolvedWord) => {
            const word: Word = this._gameManager.findWordFromLetter(sw.id, sw.orientation, false);
            if (word != null && word.letters.find((l: Letter) => l.id === letterId) != null) {
                players.push(sw.player);
            }
        });

        return players;
    }

    public selectWordFromOtherPlayer(playerId: number, letterId: number, orientation: Orientation): void {
        let player: OtherPlayersSelect = this._gridState.getValue().otherPlayersSelect.find(
            (oph: OtherPlayersSelect) => oph.playerId === playerId);
        if (player == null) {
            player = new OtherPlayersSelect(playerId, []);
            this._gridState.getValue().otherPlayersSelect.push(player);
        }

        const word: Word = this._gameManager.findWordFromLetter(letterId, orientation, true);
        if (word != null) {
            player.selectedLetters = word.letters.map((letter: Letter) => letter.id);
        }
    }

    public resetGrid(): void {
        this._gameManager.grid = new CrosswordGrid();
        this._gameManager.initializeEmptyGrid();
    }

    private setUpSingleplayer(diff: Difficulty): void {
        this._gameManager.players = [new Player(0, this.commService.returnName, 0)];

        this.commService.getCrossword(diff, INITIAL_BLACK_TILES_RATIO, INITIAL_GRID_SIZE)
            .subscribe((crosswordGrid: CrosswordGrid) => {
                this._gameManager.grid = crosswordGrid;
            });
    }

    private setUpMultiplayer(diff: Difficulty): void {
        this.commService.listenerGridReceived = (grid: CrosswordGrid) =>
            this._gameManager.grid = grid;

        this.commService.listenerPlayersReceived = (players: Player[]) =>
            this._gameManager.players = players;

        this.commService.listenerWordSelected = (playerId: number, letterId: number, orientation: Orientation) =>
            this.selectWordFromOtherPlayer(playerId, letterId, orientation);

        this.commService.listenerWordSolved = (playerId: number, word: Word) =>
            this.disableWord(word, playerId);
    }

    private findNextLetterId(isForward: boolean): number {
        if (isForward) {
            for (let i: number = this._gridState.value.selectedLetters
                .indexOf(this._gridState.value.currentLetter) + 1;
                i < this._gridState.value.selectedLetters.length; i++) {
                if (!this._gridState.value.isLetterDisabled(this._gridState.value.selectedLetters[i])) {
                    return this._gridState.value.selectedLetters[i];
                }
            }
        } else {
            for (let i: number = this._gridState.value.selectedLetters
                .indexOf(this._gridState.value.currentLetter) - 1; i >= 0; i--) {
                if (!this._gridState.value.isLetterDisabled(this._gridState.value.selectedLetters[i])) {
                    return this._gridState.value.selectedLetters[i];
                }
            }
        }

        return null;
    }

    private disableWord(word: Word, playerId: number): void {
        for (const letter of word.letters) {
            this._gridState.value.disabledLetters.push(letter.id);
            this._gameManager.setChar(letter.id, letter.char);
        }
        this.unselectWord();
        if (this._gameManager.addSolvedWord(word, playerId)) {
            this.setIsGameOver(true);
        }
    }

    private verifyWords(): void {
        const currentLetter: number = this._gridState.value.currentLetter;

        for (const orientation of Object.keys(Orientation)) {
            const playerWord: Word = this._gameManager.findWordFromLetter(currentLetter, orientation, false);
            const solvedWord: Word = this._gameManager.findWordFromLetter(currentLetter, orientation, true);

            if (playerWord != null) {
                if (playerWord.letters.map((lt: Letter) => (lt.char)).join("") ===
                    solvedWord.letters.map((lt: Letter) => (lt.char)).join("")) {

                    if (this._isSinglePlayer) {
                        this.disableWord(playerWord, this._gameManager.myPlayer.id);
                    } else {
                        this.commService.completedWord(solvedWord);
                    }
                }
            }
        }
    }
}
