import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-modal-end-game",
  templateUrl: "./modal-end-game.component.html",
  styleUrls: ["./modal-end-game.component.css"]
})

export class ModalEndGameComponent implements OnInit {
  @Output() public showModal: EventEmitter<boolean>;
  @Output() public configureNewGame: EventEmitter<void>;
  public isVictorious: boolean;
  public isMultiplayer: boolean;

  public constructor() {
    this.showModal = new EventEmitter<boolean>();
    this.configureNewGame = new EventEmitter<void>();
    this.isVictorious = true;
    this.isMultiplayer = true;
  }

  public ngOnInit(): void {
  }

  public closeGameOptions(): void {
    this.showModal.emit(false);
  }

  public startNewGame(): void {
    this.configureNewGame.emit();
  }
}
