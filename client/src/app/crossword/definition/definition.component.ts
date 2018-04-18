import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Word } from "../../../../../common/crossword/word";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Orientation } from "../../../../../common/crossword/enums-constants";
import { Letter } from "../../../../../common/crossword/letter";

export class DisplayedDefinition {
    public constructor(public definition: string, public word: string, public id: number, public nextId: number,
                       public rowNumber: number, public orientation: Orientation, public letters: Letter[]) { }
}

@Component({
    selector: "app-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent implements OnInit {
    private _cheatmode: boolean;
    public acrossDefinitions: Array<DisplayedDefinition>;
    public downDefinitions: Array<DisplayedDefinition>;
    private gridSize: number;

    public constructor(private _crosswordService: CrosswordService) {
        this._cheatmode = false;
        this.acrossDefinitions = new Array<DisplayedDefinition>();
        this.downDefinitions = new Array<DisplayedDefinition>();
        this.gridSize = 1;
    }

    public ngOnInit(): void {
        this._crosswordService.gameManager.solvedGridSubject.subscribe((grid: CrosswordGrid) => {
            this.gridSize = grid.size;
            this.acrossDefinitions = new Array<DisplayedDefinition>();
            this.downDefinitions = new Array<DisplayedDefinition>();
            const wordGrid: Array<Word> = grid.words;
            wordGrid.sort((a: Word, b: Word) => a.id - b.id);

            wordGrid.forEach((w: Word) => {
                const definition: DisplayedDefinition = this.wordToDefinition(w);

                if (w.orientation === Orientation.Across) {
                    this.acrossDefinitions.push(definition);
                } else {
                    this.downDefinitions.push(definition);
                }
            });

            this.acrossDefinitions.sort((a: DisplayedDefinition, b: DisplayedDefinition) => a.id - b.id);
            this.downDefinitions.sort((a: DisplayedDefinition, b: DisplayedDefinition) => a.id % this.gridSize - b.id % this.gridSize);
        });
    }

    public wordToDefinition(word: Word): DisplayedDefinition {
        return new DisplayedDefinition(this.upperFirstLetter(word.definitions[0].substring(word.definitions[0].indexOf("\t") + 1)),
                                       this.upperFirstLetter(word.letters.map((letter: Letter) => letter.char).join("")),
                                       word.letters[0].id, word.letters[1].id,
                                       this.getRowNumber(word.id, word.orientation),
                                       word.orientation, word.letters);
    }

    private upperFirstLetter(str: string): string {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : undefined;
    }

    private getRowNumber(id: number, orientation: Orientation): number {
        return (orientation === Orientation.Across) ? Math.floor(id / this.gridSize) + 1 : id % this.gridSize + 1;
    }

    public toogleCheatMode(): void {
        this._cheatmode = !this._cheatmode;
    }

    public get cheatMode(): boolean { return this._cheatmode; }
}
