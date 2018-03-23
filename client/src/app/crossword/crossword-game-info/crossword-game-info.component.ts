import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Difficulty } from "../../../../../common/communication/crossword-grid";
import { Player } from "../../../../../common/communication/Player";

@Component({
    selector: "app-crossword-game-info",
    templateUrl: "./crossword-game-info.component.html",
    styleUrls: ["./crossword-game-info.component.css"]
})

export class CrosswordGameInfoComponent implements OnInit {
    @Output() public newGameLoad: EventEmitter<boolean>;
    public showModal: boolean;
    private _lvl: Difficulty;
    public players: Array<Player>;
    public isCollapsedPlayer: boolean;
    public isCollapsedLevel: boolean;
    public showLevel: boolean;

    public constructor(private _crosswordService: CrosswordService) {
        this._lvl = null;
        this.isCollapsedPlayer = false;
        this.isCollapsedLevel = false;
        this.showModal = true;
        this.newGameLoad = new EventEmitter<boolean>();
        this.players = new Array<Player>();
    }

    public get lvl(): Difficulty {
        return this._lvl;
    }

    public ngOnInit(): void {
        this._crosswordService.difficulty.subscribe((difficulty: Difficulty) =>
            this._lvl = difficulty);

        this._crosswordService.players.subscribe((players: Array<Player>) =>
            this.players = players);
    }

    public loadNewGame(isNewGame: boolean): void { // TODO: Remove
        this.newGameLoad.emit(isNewGame);
    }

    public getBGColor(player: number): {} {
        return {"background-color" : this._crosswordService.getPlayerColor(player, false)};
    }
}
