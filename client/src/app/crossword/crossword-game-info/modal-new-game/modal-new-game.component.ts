import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Difficulty } from "../../../../../../common/communication/crossword-grid";
import { CrosswordService } from "../../crossword-service/crossword.service";
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;

@Component({
    selector: "app-modal-new-game",
    templateUrl: "./modal-new-game.component.html",
    styleUrls: ["./modal-new-game.component.css"]
})
export class ModalNewGameComponent implements OnInit {
    public isCollapsedAvailablePlayer: boolean = false;
    public showLevelGame: boolean = false;
    private _lvl: Difficulty;
    @Output() public isDiffSelected: EventEmitter<boolean>;

    public constructor(private _crosswordService: CrosswordService) {
        this.isCollapsedAvailablePlayer = false;
        this.showLevelGame = false;
        this._lvl = Difficulty.Easy;
        this.isDiffSelected = new EventEmitter<boolean>();

    }

    public ngOnInit(): void {
    }

    public get lvl(): Difficulty { return this._lvl; }
    public changeLevel(lvl: Difficulty): void {
        this._lvl = lvl;
        this.isDiffSelected.emit(true);
        this._crosswordService.newGame(this._lvl, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO);
    }

    public socketToServer(): void {
        this._crosswordService["commService"].createSocket();
    }
}
