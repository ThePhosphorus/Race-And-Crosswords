import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Letter, Word, Orientation, CrosswordGrid } from "../../../../../common/communication/crossword-grid";
import { SolvedWord } from "../crossword-game-manager/crossword-game-manager";

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
    private _solvedWords: SolvedWord[]; // TODO: Check if it can go in crossword Service
    public acrossDefinitions: Array<DisplayedDefinition>;
    public downDefinitions: Array<DisplayedDefinition>;

    public constructor(private _crosswordService: CrosswordService) {
        this._cheatmode = false;
        this._wordGrid = null;
        this._solvedWords = [];
        this.acrossDefinitions = new Array<DisplayedDefinition>();
        this.downDefinitions = new Array<DisplayedDefinition>();
    }

    public ngOnInit(): void {
        this._crosswordService.solvedGrid.subscribe((grid: CrosswordGrid) => {
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

        this._crosswordService.solvedWords.subscribe((solvedWords: SolvedWord[]) => {
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

    public isWordSolved(id: number): boolean {      // Take in orientation, and maybe do it in crossWord service
        return this._solvedWords.map((solvedWord: SolvedWord) => solvedWord.id).indexOf(id) > -1;
    }

    public select(index: number, orientation: string): void {
        this._crosswordService.setSelectedWord(this.findWordByIndex(index, orientation));
    }

    public hover(index: number, orientation: string): void {
        this._crosswordService.setHoveredWord(this.findWordByIndex(index, orientation));
    }

    public unHover(): void {
        this._crosswordService.setHoveredWord(null);
    }

    private findWordByIndex(index: number, orientation: string): Word {  // TODO: Put it someWhere more appropriate
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
