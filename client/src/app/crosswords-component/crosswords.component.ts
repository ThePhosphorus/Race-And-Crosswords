import { Component, OnInit } from "@angular/core";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";

@Component({
  selector: "app-crosswords",
  templateUrl: "./crosswords.component.html",
  styleUrls: ["./crosswords.component.css"],
  providers: [ CrosswordCommunicationService, CrosswordService ]
})
export class CrosswordsComponent implements OnInit {

    private _gridSize: number;

    public constructor() {
        this._gridSize = 5;
        this.words = [];
        for (let j: number = 0; j < this._gridSize; j++) {
                this.words[i] = [];
            }
     }

    public words: string[][];
    public definitions: string [][];

    public ngOnInit(): void {
        // Temp
        this.fillEmptyGrid();
    };

    private fillEmptyGrid(): void {
        for (let i: number = 0; i < this._gridSize; i++) {
            for (let j: number = 0; j < this._gridSize; j++) {
                this.words[i][j] = "";
            }
        }
    }

}
