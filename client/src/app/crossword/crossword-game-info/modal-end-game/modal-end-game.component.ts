import { Component, OnInit, EventEmitter, Output} from "@angular/core";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { Difficulty } from "../../../../../../common/crossword/enums-constants";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { Player } from "../../../../../../common/communication/Player";

@Component({
  selector: "app-modal-end-game",
  templateUrl: "./modal-end-game.component.html",
  styleUrls: ["./modal-end-game.component.css"]
})

export class ModalEndGameComponent implements OnInit {
  @Output() public showModal: EventEmitter<boolean>;
  @Output() public configureNewGame: EventEmitter<void>;
  public isWaitingRematch: boolean;
  private _isDisconnected: boolean;
  private _players: Array<Player>;

  public constructor(private _crosswordService: CrosswordService, private _commService: CrosswordCommunicationService) {
    this.showModal = new EventEmitter<boolean>();
    this.configureNewGame = new EventEmitter<void>();
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
    this._crosswordService.players.subscribe((players: Array<Player>) => {
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
    this.showModal.emit(false);
  }

  public configureGame(): void {
    this._isDisconnected = false;
    this._crosswordService.resetGrid();
    this.configureNewGame.emit();
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
    const difficulty: Difficulty = this._crosswordService.difficulty.getValue();
    this._crosswordService.newGame(difficulty, (this.isSinglePlayer||this.isDisconnected));
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
