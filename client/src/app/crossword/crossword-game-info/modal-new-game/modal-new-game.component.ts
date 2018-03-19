import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Difficulty } from "../../../../../../common/communication/crossword-grid";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { InWaitMatch } from "../../../../../../common/communication/Match";
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;

@Component({
    selector: "app-modal-new-game",
    templateUrl: "./modal-new-game.component.html",
    styleUrls: ["./modal-new-game.component.css"]
})
export class ModalNewGameComponent implements OnInit {
    public isCollapsedAvailablePlayer: boolean = false;
    public showLevelGame: boolean;
    public isReadytoPlay: boolean;
    public username: string;
    @Output() public showModal: EventEmitter<boolean>;
    private _lvl: Difficulty;
    private _matchesAvailable: Array<InWaitMatch>;
    private _isInWaitForCreateMatch: boolean;

    public constructor(private _crosswordService: CrosswordService, private commService: CrosswordCommunicationService) {
        this.isCollapsedAvailablePlayer = false;
        this.showLevelGame = false;
        this._lvl = Difficulty.Easy;
        this.username = null;
        this.showModal = new EventEmitter<boolean>();
        this.isReadytoPlay = false;
        this._matchesAvailable = [];
        this._isInWaitForCreateMatch = false;
    }

    public ngOnInit(): void {
        this.commService.getMatches().subscribe((matches: Array<InWaitMatch>) => {
            this._matchesAvailable = matches;
        });
    }

    public get matches(): Array<InWaitMatch> {
        return this._matchesAvailable;
    }
    public get lvl(): Difficulty { return this._lvl; }
    public changeLevel(lvl: Difficulty): void {
        this._lvl = lvl;
        this.isReadytoPlay = true;
    }
    public closeGameOptions(): void {
        this.showModal.emit(false);
        this.username = null;
    }
    public createNewGame(): void {
        this.commService.returnName = this.username;
        this._crosswordService.newGame(this._lvl, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO);

        if (this._isInWaitForCreateMatch) {
            this.commService.createMatch(this._lvl);
        }
        this.closeGameOptions();
    }
    public socketToServer(): void {
        this._isInWaitForCreateMatch = true;
    }

    public joinMatch(match: string): void {
        this.commService.joinMatch(match);
    }
}
