import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Letter, Word, Orientation, CrosswordGrid } from "../../../../common/communication/crossword-grid";

class DisplayedDefinition {
    public constructor(public definition: string, public word: string) {}
}

@Component({
    selector: "app-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent implements OnInit {
    @Output() public setSelectedWord: EventEmitter<Word> = new EventEmitter<Word>();
    @Output() public setHoveredWord: EventEmitter<Word> = new EventEmitter<Word>();
    @Output() public _cheatmode: boolean;
    private _wordGrid: Word[];
    public acrossDefinitions: Array<DisplayedDefinition>;
    public downDefinitions: Array<DisplayedDefinition>;

    public constructor(private _crosswordService: CrosswordService) {
        this._cheatmode = false;
        this._wordGrid = null;
    }

    public ngOnInit(): void {
        this._crosswordService.grid.subscribe((grid: CrosswordGrid) => {
            this._wordGrid = grid.words;
            this.acrossDefinitions = this._wordGrid.filter((w: Word) => w.orientation === Orientation.Across)
                .map((w: Word) => this.wordToDefinition(w));
            this.downDefinitions = this._wordGrid.filter((w: Word) => w.orientation === Orientation.Down)
                .map((w: Word) => this.wordToDefinition(w));
        });
        this._crosswordService.solvedWords.subscribe((solvedWords: number[]) => {
            this._solvedWords = solvedWords;
        });
    }

    private wordToDefinition(word: Word): DisplayedDefinition {
        return new DisplayedDefinition(this.upperFirstLetter(word.definitions[0].substring(word.definitions[0].indexOf(" ") + 1)),
                                       this.upperFirstLetter(word.letters.map((letter: Letter) => letter.char).join("")));
    }

    private upperFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public toogleCheatMode(): void {
        this._cheatmode = !this._cheatmode;
    }

    public get cheatMode(): boolean {
        return this._cheatmode;
    }

    public select(index: number, orientation: string): void {
        this.setSelectedWord.emit(this.findWordByIndex(index, orientation));
    }

    public hover(index: number, orientation: string): void {
        this.setHoveredWord.emit(this.findWordByIndex(index, orientation));
    }

    public unHover(): void {
        this.setHoveredWord.emit(null);
    }

    private findWordByIndex(index: number, orientation: string): Word {
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

        return targetWord;
    }
}
