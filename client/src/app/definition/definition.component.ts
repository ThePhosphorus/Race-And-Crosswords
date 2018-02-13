import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Letter, Word, Orientation } from "../../../../common/communication/crossword-grid";

@Component({
    selector: "app-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent implements OnInit {

    private _cheatmode: boolean;
    private _wordGrid: Word[];

    public constructor(private _crosswordService: CrosswordService) {
        this._cheatmode = false;
    }

    public ngOnInit(): void {
        this._wordGrid = this._crosswordService.words;
    }

    private get acrossDefinitions(): string[] {

        this._wordGrid = this._crosswordService.words;
        if(this._wordGrid  != null) {
        return this._wordGrid.filter((w: Word) => w.orientation === Orientation.Across)
            .map((w: Word) => (this._cheatmode) ? this.toWord(w.letters) : w.definitions[0]);
        }

        return new Array<string>();
    }

    private get downDefinitions(): string[] {
        if (this._crosswordService.words != null) {
        this._wordGrid = this._crosswordService.words;

        return this._wordGrid.filter((w: Word) => w.orientation === Orientation.Down)
            .map((w: Word) => (this._cheatmode) ? this.toWord(w.letters) : w.definitions[0]);
    }

        return new Array<string>();

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
