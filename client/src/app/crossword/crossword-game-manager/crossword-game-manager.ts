import { Player } from "../../../../../common/communication/Player";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Orientation } from "../../../../../common/crossword/enums-constants";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Letter } from "../../../../../common/crossword/letter";
import { Word } from "../../../../../common/crossword/word";

const INITIAL_GRID_SIZE: number = 10;
const SATURAION: number = 44;
const FRONT_LIGHTNESS: number = 49;
const BACK_LIGHTNESS: number = 75;
const MAX_ANGLE: number = 360;

export const EMPTY_TILE_CHARACTER: string = "\xa0\xa0";

export class SolvedWord {
    public constructor(public id: number, public orientation: Orientation, public player: number) { }
}

export class GameManager {
    private _players: BehaviorSubject<Player[]>;
    private _playerGrid: BehaviorSubject<CrosswordGrid>;
    private _solvedWords: BehaviorSubject<SolvedWord[]>;
    private _solvedGrid: BehaviorSubject<CrosswordGrid>;

    public constructor() {
        this._playerGrid = new BehaviorSubject<CrosswordGrid>(new CrosswordGrid());
        this._solvedWords = new BehaviorSubject<SolvedWord[]>(new Array<SolvedWord>());\
        this._solvedGrid = new BehaviorSubject<CrosswordGrid>(new CrosswordGrid());
        this._players = new BehaviorSubject<Player[]>(new Array<Player>());

        this.initializeEmptyGrid();
    }

    public newGame(): void {
        this._solvedGrid.next(new CrosswordGrid());
        this._playerGrid.next(new CrosswordGrid());
        this._players.next(new Array<Player>());
        this._solvedWords.next(new Array<SolvedWord>());
        this.initializeEmptyGrid();
    }

    public get solvedWordsSubject(): BehaviorSubject<SolvedWord[]> {
        return this._solvedWords;
    }

    public get playersSubject(): BehaviorSubject<Player[]> {
        return this._players;
    }

    public get playerGridSubject(): BehaviorSubject<CrosswordGrid> {
        return this._playerGrid;
    }

    public get solvedGridSubject(): BehaviorSubject<CrosswordGrid> {
        return this._solvedGrid;
    }

    public get myPlayer(): Player {
        return this._players.getValue()[0];
    }

    public get topPlayer(): Player {
        let topPlayer: Player = this.myPlayer;
        for (const player of this._players.getValue()) {
            if (player.score > topPlayer.score) {
                topPlayer = player;
            }
        }

        return topPlayer;
    }

    public set grid(crosswordGrid: CrosswordGrid) {
        const solvedGrid: CrosswordGrid = crosswordGrid;
        this.relinkLetters(solvedGrid);

        let playerGrid: CrosswordGrid = new CrosswordGrid();
        playerGrid = JSON.parse(JSON.stringify(crosswordGrid));
        this.relinkLetters(playerGrid);

        playerGrid.grid.forEach((letter: Letter) => {
            if (letter !== null) {
                if (!letter.isBlackTile) {
                    letter.char = EMPTY_TILE_CHARACTER;
                }
            }
        });

        this._playerGrid.next(playerGrid);
        this._solvedGrid.next(solvedGrid);
    }

    public set players(players: Player[]) {
        this._players.next(players);
    }

    public getChar(index: number): string {
        return this._playerGrid.getValue().grid[index].char;
    }

    public setChar(index: number, char: string): void {
        this._playerGrid.value.grid[index].char = char;
    }

    public addSolvedWord(word: Word, playerId: number): boolean {
        this._solvedWords.value.push(
            new SolvedWord(word.id, word.orientation, playerId));

        return this._solvedWords.getValue().length === this._solvedGrid.getValue().words.length;
    }

    private relinkLetters(crosswordGrid: CrosswordGrid): void {
        if (crosswordGrid) {
            crosswordGrid.words.forEach((word: Word) => {
                const linkedLetters: Letter[] = [];
                word.letters.forEach((letter: Letter) => {
                    linkedLetters.push(crosswordGrid.grid[letter.id]);
                });
                word.letters = linkedLetters;
            });
        }
    }

    public initializeEmptyGrid(): void {
        this._playerGrid.value.size = INITIAL_GRID_SIZE;
        for (let i: number = 0; i < (this._playerGrid.value.size * this._playerGrid.value.size); i++) {
            this._playerGrid.getValue().grid.push(new Letter(EMPTY_TILE_CHARACTER));
        }
    }

    public findWordFromLetter(index: number, orientation: string, isSolved: boolean): Word {
        const targetGrid: CrosswordGrid = isSolved ? this._solvedGrid.getValue() : this._playerGrid.getValue();
        for (const word of targetGrid.words) {
            if (word.orientation === orientation) {
                for (const letter of word.letters) {
                    if (index === letter.id) {
                        return word;
                    }
                }
            }
        }

        return null;
    }

    public getColorFromPlayer(playerId: number, isFrontGround: boolean): string {
        const lightness: number = (isFrontGround) ? FRONT_LIGHTNESS : BACK_LIGHTNESS;
        const hue: number = playerId * MAX_ANGLE / this._players.getValue().length;

        return "hsl(" + hue + ", " + SATURAION + "%, " + lightness + "%)";
    }

    public isWordSolved(letterId: number, orientation: Orientation): boolean {
        let isSelected: boolean = false;
        this._solvedWords.getValue().forEach((sw: SolvedWord) => {

            if (sw.id === letterId && sw.orientation === orientation) {
                isSelected = true;
            }
        });

        return isSelected;
    }

    public solvedWordPlayer(letterId: number, orientation: Orientation): number {
        for (const sw of this._solvedWords.getValue()) {
            if (sw.id === letterId && sw.orientation === orientation) {
                return sw.player;
            }
        }

        return null;
    }

}
