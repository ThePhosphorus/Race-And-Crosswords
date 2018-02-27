import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Letter, Word, Orientation, CrosswordGrid } from "../../../../common/communication/crossword-grid";

class DisplayedDefinition {
    public constructor(public definition: string, public word: string, public id: number) {}
}

@Component({
    selector: "app-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent implements OnInit {
    @Output() public setSelectedWord: EventEmitter<Word>;
    @Output() public setHoveredWord: EventEmitter<Word>;
    @Output() public _cheatmode: boolean;
    private _wordGrid: Word[];
    public solvedWords: number[];
    public acrossDefinitions: Array<DisplayedDefinition>;
    public downDefinitions: Array<DisplayedDefinition>;

    public constructor(private _crosswordService: CrosswordService) {
        this._cheatmode = false;
        this._wordGrid = null;
        this.acrossDefinitions = new Array<DisplayedDefinition>();
        this.downDefinitions = new Array<DisplayedDefinition>();
        this.setSelectedWord = new EventEmitter<Word>();
        this.setHoveredWord = new EventEmitter<Word>();
    }

    public ngOnInit(): void {
        this._crosswordService.grid.subscribe((grid: CrosswordGrid) => {
            this._wordGrid = grid.words;
            for (let i: number = 0; i < this._wordGrid.length; i++) {
                const definition: DisplayedDefinition = this.wordToDefinition(this._wordGrid[i], i);
                if (this._wordGrid[i].orientation === Orientation.Across) {
                    this.acrossDefinitions.push(definition);
                } else {
                    this.downDefinitions.push(definition);
                }
            }
        });
        this._crosswordService.solvedWords.subscribe((solvedWords: number[]) => {
            this.solvedWords = solvedWords;
        });
    }

    private wordToDefinition(word: Word, id: number): DisplayedDefinition {
        return new DisplayedDefinition(this.upperFirstLetter(word.definitions[0].substring(word.definitions[0].indexOf(" ") + 1)),
                                       this.upperFirstLetter(word.letters.map((letter: Letter) => letter.char).join("")), id);
    }

    public upperFirstLetter(str: string): string {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : undefined;
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
