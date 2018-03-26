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

    it("should be created", inject([GameManager], (gameManager: GameManager) => {
        expect(gameManager).toBeTruthy();
    }));

    it("should clear the grid when creating a new game", inject([GameManager], (gameManager: GameManager) => {
        const newGrid: CrosswordGrid = new CrosswordGrid();
        newGrid.size = 5;
        gameManager.grid = newGrid;
        gameManager.newGame(Difficulty.Easy);
        expect(gameManager.solvedGridObs.getValue()).not.toBe(newGrid);
        const grid: CrosswordGrid = new CrosswordGrid();
        expect(gameManager.solvedGridObs.getValue().grid.length).toBe(grid.grid.length);
        expect(gameManager.solvedGridObs.getValue().size).toBe(grid.size);
        expect(gameManager.solvedGridObs.getValue().words.length).toBe(grid.words.length);
    }));

    it("should put the right difficulty when creating a new game", inject([GameManager], (gameManager: GameManager) => {
        const diff: Difficulty = Difficulty.Medium;
        gameManager.newGame(diff);

        expect(gameManager.difficultyObs.getValue()).toBe(diff);
    }));

    it("should be able set players", inject([GameManager], (service: GameManager) => {
        const players: Player[] = [new Player(0, "Alpha", 0), new Player(1, "Beta", 0), new Player(2, "Charlie", 0)];
        service.players = players;

        expect(service.playersObs.getValue().length).toBe(players.length);
        expect(service.playersObs.getValue()).toBe(players);

        const player: number = 1;
        service.currentPlayer = player;
        expect(service.currentPlayerObs.getValue()).toBe(player);
    }));

    it("should add a solved word and return if it's the last one", inject([GameManager], (gameManager: GameManager) => {
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

        gameManager.grid = grid;

        const pastSolvedWordsLength: number = gameManager.solvedWordsObs.getValue().length;

        expect(gameManager.addSolvedWord(wordD, 0)).toBeFalsy();
        expect(gameManager.solvedWordsObs.getValue().length).toBe(pastSolvedWordsLength + 1);

        expect(gameManager.addSolvedWord(wordD, 0)).toBeTruthy();
        expect(gameManager.solvedWordsObs.getValue().length).toBe(pastSolvedWordsLength + 2);
    }));

    it("should be able to set and get a character", inject([GameManager], (gameManager: GameManager) => {
        const id: number = 20;
        const letter: string = "a";
        gameManager.setChar(id, letter);
        expect(gameManager.getChar(id)).toBe(letter);
    }));

    it("should get different colors, for different players", inject([GameManager], (gameManager: GameManager) => {
        gameManager.players = [new Player(0, "a", 0), new Player(1, "b", 0)];
        expect(gameManager.getColorFromPlayer(0, true)).not.toBe(gameManager.getColorFromPlayer(1, true));
        expect(gameManager.getColorFromPlayer(0, false)).not.toBe(gameManager.getColorFromPlayer(1, false));
    }));
});
