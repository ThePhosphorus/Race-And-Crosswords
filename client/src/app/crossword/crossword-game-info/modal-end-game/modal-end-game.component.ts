import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CrosswordService } from "../../crossword-service/crossword.service";

@Component({
  selector: "app-modal-end-game",
  templateUrl: "./modal-end-game.component.html",
  styleUrls: ["./modal-end-game.component.css"]
})

export class ModalEndGameComponent implements OnInit {
  @Output() public showModal: EventEmitter<boolean>;
  @Output() public configureNewGame: EventEmitter<void>;

  public constructor(private _crosswordService: CrosswordService) {
    this.showModal = new EventEmitter<boolean>();
    this.configureNewGame = new EventEmitter<void>();
  }

  public get isVictorious(): boolean {
    return this._crosswordService.isTopPlayer;
  }
  public get isMultiplayer(): boolean {
    return ! this._crosswordService.isSinglePlayer;
  }
  public ngOnInit(): void {
  }

  public closeGameOptions(): void {
    this.showModal.emit(false);
  }

  public configureGame(): void {
    this.configureNewGame.emit();
  }

}
