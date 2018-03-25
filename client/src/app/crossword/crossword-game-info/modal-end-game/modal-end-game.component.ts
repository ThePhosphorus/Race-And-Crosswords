import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-modal-end-game",
  templateUrl: "./modal-end-game.component.html",
  styleUrls: ["./modal-end-game.component.css"]
})

export class ModalEndGameComponent implements OnInit {
  @Output() public showModal: EventEmitter<boolean>;
  public constructor() {
    this.showModal = new EventEmitter<boolean>();
   }

  public ngOnInit(): void {
  }

  public closeGameOptions(): void {
    this.showModal.emit(false);
  }
}
