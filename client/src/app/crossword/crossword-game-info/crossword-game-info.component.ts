import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Difficulty } from "../../../../../common/communication/crossword-grid";

@Component({
    selector: "app-crossword-game-info",
    templateUrl: "./crossword-game-info.component.html",
    styleUrls: ["./crossword-game-info.component.css"]
})

export class CrosswordGameInfoComponent implements OnInit {
    @Output() public newGameLoad: EventEmitter<boolean>;
    public isReadytoPlay: boolean;
    private _lvl: Difficulty;
    public nbPlayers: number;
    public isCollapsedPlayer: boolean = false;
    public isCollapsedLevel: boolean = false;
    public showLevel: boolean;

    public constructor(private _crosswordService: CrosswordService) {
        this._lvl = null;
        this.isCollapsedPlayer = false;
        this.isCollapsedLevel = false;
        this.showLevel = false;
        this.isReadytoPlay = false;
        this.newGameLoad = new EventEmitter<boolean>();
    }
    public get lvl(): Difficulty {
        return this._lvl;
    }

    public ngOnInit(): void {
        this.nbPlayers = 1;
        this._crosswordService.difficulty.subscribe((difficulty: Difficulty) => {
            this._lvl = difficulty;
        });
    }

    public loadNewGame(isNewGame: boolean): void {
        this.newGameLoad.emit(isNewGame);
    }

}
