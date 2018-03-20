import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Word } from "../../../../../common/crossword/word";
import { Orientation } from "../../../../../common/crossword/enums-constants";
import { Letter } from "../../../../../common/crossword/letter";
import { DisplayService } from "../display-service/display.service";

class DisplayedDefinition {
    public constructor(public definition: string, public word: string, public id: number) {}
}

@Component({
    selector: "app-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent implements OnInit {
    private _wordGrid: Word[];
    private _cheatmode: boolean;
    private _solvedWords: number[];
    public acrossDefinitions: Array<DisplayedDefinition>;
    public downDefinitions: Array<DisplayedDefinition>;

    public constructor(private _crosswordService: CrosswordService, private _displayService: DisplayService) {
        this._cheatmode = false;
        this._wordGrid = null;
        this._solvedWords = [];
        this.acrossDefinitions = new Array<DisplayedDefinition>();
        this.downDefinitions = new Array<DisplayedDefinition>();
    }

    public ngOnInit(): void {
        this._crosswordService.grid.subscribe((grid: CrosswordGrid) => {
            this.acrossDefinitions = new Array<DisplayedDefinition>();
            this.downDefinitions = new Array<DisplayedDefinition>();
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
            this._solvedWords = solvedWords;
        });
    }

    private wordToDefinition(word: Word, id: number): DisplayedDefinition {
        return new DisplayedDefinition(this.upperFirstLetter(word.definitions[0].substring(word.definitions[0].indexOf(" ") + 1)),
                                       this.upperFirstLetter(word.letters.map((letter: Letter) => letter.char).join("")), id);
    }

    private upperFirstLetter(str: string): string {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : undefined;
    }

    public toogleCheatMode(): void {
        this._cheatmode = !this._cheatmode;
    }

    public get cheatMode(): boolean { return this._cheatmode; }

    public isWordSolved(id: number): boolean {
        return this._solvedWords.indexOf(id) > -1;
    }

    public select(index: number, orientation: string): void {
        this._displayService.setSelectedWord(this.findWordByIndex(index, orientation));
    }

    public hover(index: number, orientation: string): void {
        this._displayService.setHoveredWord(this.findWordByIndex(index, orientation));
    }

    public unHover(): void {
        this._displayService.setHoveredWord(null);
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
