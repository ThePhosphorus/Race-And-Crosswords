import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Difficulty } from "../../../../../../common/communication/crossword-grid";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { InWaitMatch } from "../../../../../../common/communication/Match";

@Component({
    selector: "app-modal-new-game",
    templateUrl: "./modal-new-game.component.html",
    styleUrls: ["./modal-new-game.component.css"]
})
export class ModalNewGameComponent implements OnInit {
    public isCollapsedAvailablePlayer: boolean;
    public showLevelGame: boolean;
    @Output() public showModal: EventEmitter<boolean>;
    @Output() public showSearching: EventEmitter<boolean>;
    public username: string;
    public lvl: Difficulty;
    public isSinglePlayer: boolean;
    public joinedPlayer: string;

    private _matchesAvailable: Array<InWaitMatch>;

    public constructor(private _crosswordService: CrosswordService, private commService: CrosswordCommunicationService) {
        this.isCollapsedAvailablePlayer = false;
        this.showLevelGame = false;
        this.showModal = new EventEmitter<boolean>();
        this.showSearching = new EventEmitter<boolean>();
        this.lvl = null;
        this.username = null;
        this.isSinglePlayer = null;
        this.joinedPlayer = null;
        this._matchesAvailable = [];
    }

    public ngOnInit(): void {
        this.getMatches();
    }

    public getMatches(): void {
        this.commService.getMatches().subscribe((matches: Array<InWaitMatch>) => {
            this._matchesAvailable = matches;
        });
    }

    public get matches(): Array<InWaitMatch> {
        return this._matchesAvailable;
    }

    public get isReadyToPlay(): boolean {
        return (this.isSinglePlayer !== null &&
                this.username !== null &&
                this.username !== "" &&
                this.lvl !== null);
    }

    public closeGameOptions(): void {
        this.showModal.emit(false);
        this.username = null;
    }

    public createNewGame(): void {
        this.commService.returnName = this.username;

        if (!this.isSinglePlayer) {
            this.showSearching.emit(true);
            if (this.joinedPlayer === null) {
                this.commService.createMatch(this.lvl);
            } else {
                this.commService.joinMatch(this.joinedPlayer);
            }
        }
        this._crosswordService.newGame(this.lvl, this.isSinglePlayer);
        this.closeGameOptions();
    }

    public joinMatch(match: InWaitMatch): void {
        this.joinedPlayer = match.name;
        this.lvl = match.difficulty;
    }

    public showLevelChoice(bool: boolean): void {
        this.isCollapsedAvailablePlayer = (bool) ? false : !this.isCollapsedAvailablePlayer;
        this.showLevelGame = bool;
    }

    public isDiff( diff: Difficulty): boolean {
        return diff === this.lvl;
    }
}
