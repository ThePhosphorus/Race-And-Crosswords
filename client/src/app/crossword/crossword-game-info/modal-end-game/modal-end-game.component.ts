import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { Difficulty } from "../../../../../../common/crossword/enums-constants";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { Player } from "../../../../../../common/communication/Player";
import { GameInfoService } from "../game-info-service/game-info.service";

@Component({
    selector: "app-modal-end-game",
    templateUrl: "./modal-end-game.component.html",
    styleUrls: ["./modal-end-game.component.css"]
})

export class ModalEndGameComponent implements OnInit {
    public isWaitingRematch: boolean;
    private _isDisconnected: boolean;
    private _players: Array<Player>;

    public constructor(private _crosswordService: CrosswordService,
                       private _infoService: GameInfoService, private _commService: CrosswordCommunicationService) {
        this.isWaitingRematch = false;
        this._isDisconnected = false;
        this._players = new Array<Player>();
    }

    public get isDisconnected(): boolean {
        return this._isDisconnected;
    }
    public get players(): Array<Player> {
        return this._players;
    }
    public get isVictorious(): boolean {
        return this._crosswordService.isTopPlayer;
    }
    public get isSinglePlayer(): boolean {
        return this._crosswordService.isSinglePlayer;
    }
    public ngOnInit(): void {
        this._crosswordService.gameManager.playersSubject.subscribe((players: Array<Player>) => {
            if (players.length < 2) {
                this._isDisconnected = true;
            }
            this._players = players;
            if (players.length > 1 && this.isWaitingRematch) {
                this.verifyRematchPlayers();
            }
        });
    }

    public closeModal(): void {
        this._infoService.setShowModal(false);
    }

    public configureGame(): void {
        this._isDisconnected = false;
        this._crosswordService.resetGrid();
        this._infoService.configureNewGame();
    }

    public replay(): void {

        if (!this.isSinglePlayer) {
            this._commService.rematch();
            this.isWaitingRematch = true;
            if (this.isDisconnected) {
                this.newGame();
            }
        } else {
            this.newGame();
        }

    }

    public newGame(): void {
        const difficulty: Difficulty = this._crosswordService.gameManager.difficultySubject.getValue();
        this._crosswordService.newGame(difficulty, (this.isSinglePlayer));
        this.closeModal();
    }


    public verifyRematchPlayers(): void {
        for (const player of this.players) {
            if (!player.wantsRematch) {
                return;
            }
        }
        this.newGame();
    }

}
