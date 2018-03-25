import { TestBed, inject } from "@angular/core/testing";
import { GameManager } from "./crossword-game-manager";
import { CrosswordGrid, Difficulty } from "../../../../../common/communication/crossword-grid";
import { Player } from "../../../../../common/communication/Player";

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

});
