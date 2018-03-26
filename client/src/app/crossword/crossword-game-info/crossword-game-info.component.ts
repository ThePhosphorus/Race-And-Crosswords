import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Player } from "../../../../../common/communication/Player";
import { Difficulty } from "../../../../../common/crossword/enums-constants";

@Component({
    selector: "app-crossword-game-info",
    templateUrl: "./crossword-game-info.component.html",
    styleUrls: ["./crossword-game-info.component.css"]
})

export class CrosswordGameInfoComponent implements OnInit {
    @Output() public showSearching: EventEmitter<boolean>;
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
        this.showSearching = new EventEmitter<boolean>();
        this.players = new Array<Player>();
    }

    public get isEndGame(): boolean {
        const bool: boolean = this._crosswordService.isGameOver;
        if (bool) {
            this.loadNewGame();
        }

        return bool;
    }

    public get lvl(): Difficulty {
        return this._lvl;
    }

    public ngOnInit(): void {
        this._crosswordService.gameManager.difficultyObs.subscribe((difficulty: Difficulty) =>
            this._lvl = difficulty);

        this._crosswordService.gameManager.playersObs.subscribe((players: Array<Player>) => {
            if (players.length < this.players.length) {
                this._crosswordService.isGameOver = true;
            }
            this.players = players;
            if (players.length > 1) {
                this.showSearching.emit(false);
            }
        });
    }

    public getBGColor(player: number): {} {
        return { "background-color": this._crosswordService.getPlayerColor(player, false) };
    }

    public loadNewGame(): void {
        this.showModal = true;
        this.showSearching.emit(false);
    }

    public configureNewGame(): void {
        this._crosswordService.isGameOver = false;
    }
}
