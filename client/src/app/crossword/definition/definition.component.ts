import { Component, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Letter, Word, Orientation, CrosswordGrid } from "../../../../../common/communication/crossword-grid";
import { GridState } from "../grid-state/grid-state";

class DisplayedDefinition {
    public constructor(public definition: string, public word: string, public id: number) {}
}

@Component({
    selector: "app-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent implements OnInit {
    private _gridState: GridState;
    private _cheatmode: boolean;
    public acrossDefinitions: Array<DisplayedDefinition>;
    public downDefinitions: Array<DisplayedDefinition>;
    private gridSize: number;

    public constructor(private _crosswordService: CrosswordService) {
        this._crosswordService.gridStateObs.subscribe((gs: GridState) =>
            this._gridState = gs);

        this._cheatmode = false;
        this.acrossDefinitions = new Array<DisplayedDefinition>();
        this.downDefinitions = new Array<DisplayedDefinition>();
        this.gridSize = 1;
    }

    public ngOnInit(): void {
        this._crosswordService.solvedGrid.subscribe((grid: CrosswordGrid) => {
            this.gridSize = grid.size;
            this.acrossDefinitions = new Array<DisplayedDefinition>();
            this.downDefinitions = new Array<DisplayedDefinition>();
            const wordGrid: Array<Word> = grid.words;
            wordGrid.sort((a: Word, b: Word) => a.id - b.id);

            wordGrid.forEach((w: Word) => {
                const definition: DisplayedDefinition =
                this.wordToDefinition(w, w.id);

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

    public isWordSolved(id: number, orientation: Orientation): boolean {
        return this._crosswordService.wordIsSelected(id, orientation);
    }

    public getRowCOl(id: number, orientation: Orientation): number {
        return (orientation === Orientation.Across) ? Math.floor(id / this.gridSize) : id % this.gridSize;
    }

    public select(index: number, orientation: Orientation): void {
        this._crosswordService.setSelectedWord(index, orientation);
    }

    public hover(index: number, orientation: Orientation): void {
        this._crosswordService.setHoveredWord(index, orientation);
    }

    public unHover(): void {
        this._crosswordService.setHoveredWord(null, null);
    }
}
