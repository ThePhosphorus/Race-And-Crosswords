import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Difficulty } from "../../../../common/communication/crossword-grid";
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;

@Component({
    selector: "app-crossword-game-info",
    templateUrl: "./crossword-game-info.component.html",
    styleUrls: ["./crossword-game-info.component.css"]
})

export class CrosswordGameInfoComponent implements OnInit {

    public nbPlayers: number;
    public lvl: Difficulty;
    public isCollapsedPlayer: boolean = false;
    public isCollapsedLevel: boolean = false;

    public constructor(private _crosswordService: CrosswordService) {
        this.lvl = Difficulty.Easy;
        this.isCollapsedPlayer = false;
        this.isCollapsedLevel = false;
    }

    public ngOnInit(): void {
        this.nbPlayers = 1;
        this.lvl = Difficulty.Easy;
    }
    public changeLevel(lvl: Difficulty): void {
        this.lvl = lvl;
        this._crosswordService.newGame(this.lvl, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO);
    }
}
