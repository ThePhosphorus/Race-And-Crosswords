import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Difficulty } from "../../../../common/communication/crossword-grid";
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;

@Component({
    selector: "app-playermode",
    templateUrl: "./playermode.component.html",
    styleUrls: ["./playermode.component.css"]
})

export class PlayermodeComponent implements OnInit {

    public nbPlayers: number;
    public lvl: Difficulty;
    public isCollapsed: boolean = false;
    public isCollapsed2: boolean = false;

    public constructor(private _crosswordService: CrosswordService) {
        this.lvl = Difficulty.Easy;
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
