import { Component, OnInit } from "@angular/core";

enum DifficultyLevel {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard"
}

@Component({
    selector: "app-playermode" ,
    templateUrl: "./playermode.component.html",
    styleUrls: ["./playermode.component.css"]
})

export class PlayermodeComponent implements OnInit {

    public nbPlayers: number;
    public lvl: DifficultyLevel;
    public isCollapsed: boolean = false;
    public isCollapsed2: boolean = false;

    public constructor() { }

    public ngOnInit(): void {
        this.nbPlayers = 1;
        this.lvl = DifficultyLevel.Easy;
    }
}
