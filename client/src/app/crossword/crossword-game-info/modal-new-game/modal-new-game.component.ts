import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { InWaitMatch } from "../../../../../../common/communication/Match";
import { Difficulty } from "../../../../../../common/crossword/enums-constants";
import { GameInfoService } from "../game-info-service/game-info.service";

@Component({
    selector: "app-modal-new-game",
    templateUrl: "./modal-new-game.component.html",
    styleUrls: ["./modal-new-game.component.css"]
})
export class ModalNewGameComponent implements OnInit {
    public isCollapsedAvailablePlayer: boolean;
    public showLevelGame: boolean;
    public username: string;
    public isSinglePlayer: boolean;
    public joinedPlayer: string;

    private _matchesAvailable: Array<InWaitMatch>;

    public constructor(private _crosswordService: CrosswordService,
                       private _infoService: GameInfoService, private commService: CrosswordCommunicationService) {
        this.isCollapsedAvailablePlayer = false;
        this.username = null;
        this.isSinglePlayer = null;
        this.joinedPlayer = null;
        this._matchesAvailable = [];
    }

    public ngOnInit(): void {
        this.getMatchesFromServer();
    }
    public get showModal(): boolean {
        return this._infoService.showModal.getValue();
    }
    public get level(): Difficulty {
        return this._infoService.lvl.getValue();
    }

    public setLevel(diff: Difficulty): void {
        this._infoService.setLvl(diff);
    }

    public getMatchesFromServer(): void {
        this.commService.getMatches().subscribe((matches: Array<InWaitMatch>) => {
            this._matchesAvailable = matches;
            console.log(this._matchesAvailable);
        });
    }

    public get matches(): Array<InWaitMatch> {
        return this._matchesAvailable;
    }

    public get isReadyToPlay(): boolean {
        return (this.isSinglePlayer != null &&
            this.username != null &&
            this.username !== "" &&
            this.level != null);
    }

    public closeGameOptions(): void {
        this._infoService.setShowModal(false);
        this.username = null;
    }

    public createNewGame(): void {
        this.commService.returnName = this.username;

        if (!this.isSinglePlayer) {
            this._infoService.setShowSearching(true);
            if (this.joinedPlayer === null) {
                this.commService.createMatch(this.level);
            } else {
                this.commService.joinMatch(this.joinedPlayer);
            }
        }
        this._crosswordService.newGame(this.level, this.isSinglePlayer);
        this.closeGameOptions();
    }

    public joinMatch(match: InWaitMatch): void {
        this.joinedPlayer = match.name;
        this.setLevel(match.difficulty);
        this.showLevelChoice(true);
    }

    public showLevelChoice(bool: boolean): void {
        this.isCollapsedAvailablePlayer = (bool) ? false : !this.isCollapsedAvailablePlayer;
        this.showLevelGame = bool;
    }

    public chooseMode(isSinglePlayer: boolean): void {
        this.isSinglePlayer = isSinglePlayer;
        this.showLevelChoice(isSinglePlayer);

        if (!isSinglePlayer) {
            this.getMatchesFromServer();
        }
    }

}
