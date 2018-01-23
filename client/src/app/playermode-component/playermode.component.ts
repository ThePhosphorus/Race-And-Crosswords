import { Component, OnInit } from "@angular/core";

enum DifficultyLevel {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard"
}

@Component({
  selector: "app-playermode",
  templateUrl: "./playermode.component.html",
  styleUrls: ["./playermode.component.css"]
})

export class PlayermodeComponent implements OnInit {

  public nbPlayers: number = 2;
  public lvl: DifficultyLevel;

  public constructor() { }

  public ngOnInit(): void {
  }

}
