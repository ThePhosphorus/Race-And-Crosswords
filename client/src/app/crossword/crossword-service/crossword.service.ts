import { Injectable } from "@angular/core";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { GameManager, EMPTY_TILE_CHARACTER, SolvedWord } from "../crossword-game-manager/crossword-game-manager";
import { GridState } from "../grid-state/grid-state";
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

class OtherPlayersHover {
    public constructor(public playerId: number, public selectedLetters: Array<number>) { }
}

@Injectable()
export class CrosswordService {
    private _gameManager: GameManager;
    private _gridState: BehaviorSubject<GridState>;
    private _otherPlayersHover: Array<OtherPlayersHover>;
    private _isSinglePlayer: boolean;
    public isGameOver: boolean;

    public constructor(private commService: CrosswordCommunicationService) {
        this._gameManager = new GameManager();
        this._gridState = new BehaviorSubject<GridState>(new GridState());
        this._otherPlayersHover = new Array<OtherPlayersHover>();
        this._isSinglePlayer = true;
        this.isGameOver = false;
        if (USE_MOCK_GRID) {
            this._gameManager.grid = MOCK;
        }
    }

    public get isTopPlayer(): boolean {
        return this._gameManager.topPlayer === this._gameManager.myPlayer;
    }
    public get isSinglePlayer(): boolean {
        return this._isSinglePlayer;
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
        return this._gridState;
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

    public getChar(letterId: number): string {
        return this._gameManager.getChar(letterId);
    }

    public newGame(difficulty: Difficulty, isSinglePlayer: boolean): void {
        if (!USE_MOCK_GRID) {
            this._isSinglePlayer = isSinglePlayer;
            this._gameManager.newGame(difficulty);
            this.isGameOver = false;
            this._gridState.next(new GridState());

            if (isSinglePlayer) {
                this.setUpSingleplayer(difficulty);
            } else {
                this.setUpMultiplayer(difficulty);
            }
        }
    }

    private setUpSingleplayer(diff: Difficulty): void {
        this._gameManager.players = [new Player(0, this.commService.returnName, 0)];

        this.commService.getCrossword(diff, INITIAL_BLACK_TILES_RATIO, INITIAL_GRID_SIZE)
            .subscribe((crosswordGrid: CrosswordGrid) => {
                this._gameManager.grid = crosswordGrid;
            });
    }

    private setUpMultiplayer(diff: Difficulty): void {
        this.commService.listenerReceiveGrid = (grid: CrosswordGrid) =>
            this._gameManager.grid = grid;

        this.commService.listenerReceivePlayers = (players: Player[]) => {
            this._gameManager.players = players;
            this._gameManager.currentPlayer = this.commService.returnName;
        };
        this.commService.listenerReceiveSelect = (playerId: number, letterId: number, orientation: Orientation) =>
            this.selectWordFromOtherPlayer(playerId, letterId, orientation);

        this.commService.listenerIsCompletedFirst = (playerId: number, word: Word) =>
            this.disableWord(word, playerId);
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
        if (!this._gridState.value.LIsDisabled(index)) {
            if (this._gridState.value.LIsCurrentLetter(index)) {
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
                if (this._gridState.value.LIsDisabled(this._gridState.value.currentLetter)) {
                    this._gridState.value.currentLetter = this.findNextLetterId(true);
                }
            }
        }
    }

    public setSelectedWord(letterId: number, orientation: Orientation): void {
        let startingIndex: number = null;
        const word: Word = this._gameManager.findWordFromLetter(letterId, orientation, false);

        for (const letter of word.letters) {
            if (!this._gridState.value.LIsDisabled(letter.id)) {
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

    private disableWord(word: Word, playerId: number): void {
        for (const letter of word.letters) {
            this._gridState.value.disabledLetters.push(letter.id);
            this._gameManager.setChar(letter.id, letter.char);
        }
        this.unselectWord();
        if (this._gameManager.addSolvedWord(word, playerId)) {
            this.isGameOver = true;
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
                        this.disableWord(playerWord, this._gameManager.currentPlayerObs.getValue());
                    } else {
                        this.commService.completedWord(solvedWord);
                    }
                }
            }
        }
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

    private findNextLetterId(isForward: boolean): number {
        if (isForward) {
            for (let i: number = this._gridState.value.selectedLetters
                .indexOf(this._gridState.value.currentLetter) + 1;
                i < this._gridState.value.selectedLetters.length; i++) {
                if (!this._gridState.value.LIsDisabled(this._gridState.value.selectedLetters[i])) {
                    return this._gridState.value.selectedLetters[i];
                }
            }
        } else {
            for (let i: number = this._gridState.value.selectedLetters
                .indexOf(this._gridState.value.currentLetter) - 1; i >= 0; i--) {
                if (!this._gridState.value.LIsDisabled(this._gridState.value.selectedLetters[i])) {
                    return this._gridState.value.selectedLetters[i];
                }
            }
        }

        return null;
    }

    public getLetterSelectPlayers(letterId: number): Array<number> {
        const players: Array<number> = new Array<number>();
        if (this._gridState.getValue().LIsSelected(letterId)) {
            players.push(this._gameManager.currentPlayerObs.getValue());
        }

        this._otherPlayersHover.forEach((oph: OtherPlayersHover) => {
            if (oph.selectedLetters.indexOf(letterId) > -1) {
                players.push(oph.playerId);
            }
        });

        return players;
    }

    public getLetterDisabledPlayers(letterId: number): Array<number> {
        const players: Array<number> = new Array<number>();

        this._gameManager.solvedWordsObs.getValue().forEach((sw: SolvedWord) => {
            const word: Word = this._gameManager.findWordFromLetter(sw.id, sw.orientation, false);
            if (word != null && word.letters.find((l: Letter) => l.id === letterId) != null) {
                players.push(sw.player);
            }
        });

        return players;
    }

    public selectWordFromOtherPlayer(playerId: number, letterId: number, orientation: Orientation): void {
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

    public getPlayerColor(playerId: number, isFrontGround: boolean): string {
        return this._gameManager.getColorFromPlayer(playerId, isFrontGround);
    }

    public wordIsSolved(letterId: number, orientaion: Orientation): boolean {
        let isSelected: boolean = false;
        this.solvedWords.getValue().forEach((sw: SolvedWord) => {

            if (sw.id === letterId && sw.orientation === orientaion) {
                isSelected = true;
            }
        });

        return isSelected;
    }
    public resetGrid(): void {
        this._gameManager.grid = new CrosswordGrid();
    }
}
