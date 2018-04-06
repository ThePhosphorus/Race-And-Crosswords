import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Player } from "../../../../../common/communication/Player";
import { Difficulty } from "../../../../../common/crossword/enums-constants";
import { GameInfoService } from "./game-info-service/game-info.service";

@Component({
    selector: "app-crossword-game-info",
    templateUrl: "./crossword-game-info.component.html",
    styleUrls: ["./crossword-game-info.component.css"]
})

export class CrosswordGameInfoComponent implements OnInit {
    public players: Array<Player>;
    public isCollapsedPlayer: boolean;
    public isCollapsedLevel: boolean;
    private _isEndGame: boolean;

    public constructor(private _crosswordService: CrosswordService, private _infoService: GameInfoService) {
        this.isCollapsedPlayer = false;
        this.isCollapsedLevel = false;
        this._isEndGame = false;
        this.players = new Array<Player>();
    }

    public get isEndGame(): boolean {
        return this._isEndGame;
    }

    public get lvl(): Difficulty {
        return this._infoService.lvl.getValue();
    }

    public get showModal(): boolean {
        return this._infoService.showModal.getValue();
    }

    public ngOnInit(): void {
        this._crosswordService.gameManager.playersSubject.subscribe((players: Array<Player>) => {
            if (players.length < this.players.length) {
                this._crosswordService.setIsGameOver(true);
            } else if (this._crosswordService.isSinglePlayer || players.length > 1) {
                this._infoService.setShowSearching(false);
            }
            this.players = players;
        });
        this._crosswordService.isGameOver.subscribe((bool: boolean) => {
            if (bool) {
                this.loadNewGame();
            }
            this._isEndGame = bool;
        }
        );
    }

    public getBGColor(player: number): {} {
        return { "background-color": this._crosswordService.getPlayerColor(player, false) };
    }

    public loadNewGame(): void {
        this._infoService.setShowModal(true);
        this._infoService.setShowSearching(true);
        this._infoService.setShowLoading(true);
    }
}
