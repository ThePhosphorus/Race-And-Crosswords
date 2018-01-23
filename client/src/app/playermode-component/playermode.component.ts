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

  public noPlayer: number = 2;
  public lvlEnum: DifficultyLevel;

  public constructor() { }

  public ngOnInit(): void {
  }

}
