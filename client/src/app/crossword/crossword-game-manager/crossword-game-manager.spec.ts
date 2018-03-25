import { TestBed, inject } from "@angular/core/testing";
import { GameManager } from "./crossword-game-manager";
import { Player } from "../../../../../common/communication/Player";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Difficulty, Orientation } from "../../../../../common/crossword/enums-constants";
import { Word } from "../../../../../common/crossword/word";
import { Letter } from "../../../../../common/crossword/letter";

// tslint:disable:no-magic-numbers
describe("CrosswordGameManager", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameManager]
        });
    });

    it("should be created", inject([GameManager], (service: GameManager) => {
        expect(service).toBeTruthy();
    }));

    it("should clear the grid when creating a new game", inject([GameManager], (service: GameManager) => {
        const newGrid: CrosswordGrid = new CrosswordGrid();
        newGrid.size = 5;
        service.grid = newGrid;
        service.newGame(Difficulty.Easy);
        expect(service.solvedGridObs.getValue()).not.toBe(newGrid);
        expect(service.solvedGridObs.getValue()).toBe(new CrosswordGrid());
    }));

    it("should put the right difficulty when creating a new game", inject([GameManager], (service: GameManager) => {
        const diff: Difficulty = Difficulty.Medium;
        service.newGame(diff);

        expect(service.difficultyObs.getValue()).toBe(diff);
    }));

    it("should be able set players", inject([GameManager], (service: GameManager) => {
        const players: Player[] = [new Player(0, "Alpha", 0), new Player(0, "Beta", 0), new Player(0, "Charlie", 0)];
        service.players = players;

        expect(service.playersObs.getValue().length).toBe(players.length);
        expect(service.playersObs.getValue()).toBe(players);

        const player: number = 1;
        service.currentPlayer = players[player].name;
        expect(service.currentPlayerObs.getValue()).toBe(player);
    }));

    it("should add a solved word and return if it's the last one", inject([GameManager], (service: GameManager) => {
        const wordA: Word = new Word();
        wordA.letters = [new Letter("w", 0), new Letter("o", 1), new Letter("r", 2), new Letter("d", 3)];
        wordA.id = 0;
        wordA.orientation = Orientation.Across;

        const wordD: Word = new Word();
        wordD.letters = [new Letter("w", 0), new Letter("i", 4), new Letter("n", 8), new Letter("g", 12)];
        wordD.id = 0;
        wordD.orientation = Orientation.Down;

        const grid: CrosswordGrid = new CrosswordGrid();
        grid.size = 4;
        grid.words.push(wordA);
        grid.words.push(wordD);

        wordA.letters.forEach((l: Letter) => grid.grid[l.id] = l);
        wordD.letters.forEach((l: Letter) => grid.grid[l.id] = l)   ;

        service.grid = grid;

        const pastSolvedWordsLength: number = service.solvedWordsObs.getValue().length;

        expect(service.addSolvedWord(wordD, 0)).toBeFalsy();
        expect(service.solvedWordsObs.getValue().length).toBe(pastSolvedWordsLength + 1);

        expect(service.addSolvedWord(wordD, 0)).toBeTruthy();
        expect(service.solvedWordsObs.getValue().length).toBe(pastSolvedWordsLength + 2);

    }));
});
