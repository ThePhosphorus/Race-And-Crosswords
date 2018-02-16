import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Letter, Word, Orientation, CrosswordGrid } from "../../../../common/communication/crossword-grid";

@Component({
    selector: "app-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent implements OnInit {
    @Output() public setSelectedWord: EventEmitter<Word> = new EventEmitter<Word>();
    private _cheatmode: boolean;
    private _wordGrid: Word[];
    public acrossDefinitions: {[cheat: string]: string}[];
    public downDefinitions: {[cheat: string]: string}[];

    public constructor(private _crosswordService: CrosswordService) {
        this._cheatmode = false;
        this._wordGrid = null;
    }

    public ngOnInit(): void {
        this._crosswordService.grid.subscribe((grid: CrosswordGrid) => {
            this._wordGrid = grid.words;
            this.updateDefinitions();
        });
    }

    private updateDefinitions(): void {
        this.acrossDefinitions = this._wordGrid.filter((w: Word) => w.orientation === Orientation.Across)
            .map((w: Word) => this.toDictionary(w));
        this.downDefinitions = this._wordGrid.filter((w: Word) => w.orientation === Orientation.Down)
            .map((w: Word) => this.toDictionary(w));
    }

    private toDictionary(word: Word): {[cheat: string]: string} {
        const temp: {[cheat: string]: string} = {};
        temp["true"] = this.toWord(word.letters);
        const trimmedDefinition: string = word.definitions[0].substring(word.definitions[0].indexOf(" ") + 1);
        temp["false"] = trimmedDefinition.charAt(0).toUpperCase() + trimmedDefinition.slice(1);

        return temp;
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

    public select(index: number, orientation: string): void {
        let targetWord: Word;
        for (const word of this._wordGrid) {
            if (word.orientation === orientation) {
                if (index > 0) {
                    index--;
                } else {
                    targetWord = word;
                    break;
                }
            }
        }
        this.setSelectedWord.emit(targetWord);
    }
}
