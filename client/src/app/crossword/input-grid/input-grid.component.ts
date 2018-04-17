import { Component, OnInit, HostListener} from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Letter } from "../../../../../common/crossword/letter";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { GameInfoService } from "../crossword-game-info/game-info-service/game-info.service";

@Component({
    selector: "app-input-grid",
    templateUrl: "./input-grid.component.html",
    styleUrls: ["./input-grid.component.css"]
})
export class InputGridComponent implements OnInit {

    public twoDimensionGrid: Letter[][];

    public constructor(private _crosswordService: CrosswordService, private _infoService: GameInfoService) {
        this.twoDimensionGrid = new Array<Array<Letter>>();

    }

    public ngOnInit(): void {
        this._crosswordService.gameManager.playerGridSubject.subscribe((crosswordGrid: CrosswordGrid) => {
            if (crosswordGrid.words.length > 0) {
                this.makeTwoDimensionGrid(crosswordGrid);
                this._infoService.setShowLoading(false);
            }
        });
    }

    private makeTwoDimensionGrid(grid: CrosswordGrid): void {
        this.twoDimensionGrid = new Array<Array<Letter>>();

        for (let i: number = 0; i < grid.size; i++) {
            this.twoDimensionGrid.push(new Array<Letter>());

            for (let j: number = 0; j < grid.size; j++) {
                this.twoDimensionGrid[i].push(grid.grid[(i * grid.size) + j]);
            }
        }
    }

    public unselectWord(): void {
        this._crosswordService.unselectWord();
    }

    @HostListener("window:keyup", ["$event"])
    public writeChar(event: KeyboardEvent): void {
        this._crosswordService.writeChar(event.key);
    }
}
