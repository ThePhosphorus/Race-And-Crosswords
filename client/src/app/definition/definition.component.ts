import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { Letter, Word, Orientation, CrosswordGrid } from "../../../../common/communication/crossword-grid";

@Component({
    selector: "app-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"],
    providers: [CrosswordService, CrosswordCommunicationService]
})
export class DefinitionComponent implements OnInit {
    private _cheatmode: boolean;
    private _wordGrid: Word[];

    public constructor(private _crosswordService: CrosswordService) {
        this._cheatmode = false;
        this._wordGrid = null;
    }

    public ngOnInit(): void {
        this._crosswordService.words
            .subscribe((grid: CrosswordGrid) => {
                this._wordGrid = grid.words;
            });
    }

    private get acrossDefinitions(): string[] {
        return this._wordGrid.filter((w: Word) => w.orientation === Orientation.Across)
            .map((w: Word) => (this._cheatmode) ? this.toWord(w.letters) : w.definitions[0]);
    }

    private get downDefinitions(): string[] {
        return this._wordGrid.filter((w: Word) => w.orientation === Orientation.Down)
            .map((w: Word) => (this._cheatmode) ? this.toWord(w.letters) : w.definitions[0]);
    }

    private toWord(letters: Letter[]): string {
        let str: string = "";
        letters.forEach((letter: Letter) => {
            str += letter.char;
        });

        return str;
    }
    public toogleCheatMode(): void {
        this._cheatmode = !this._cheatmode;
    }

    public get cheatMode(): boolean {
        return this._cheatmode;
    }

}
