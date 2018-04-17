import { Component, Input, ElementRef, OnInit } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { DisplayedDefinition } from "../definition/definition.component";
import { GridState } from "../grid-state/grid-state";
import { Letter } from "../../../../../common/crossword/letter";

@Component({
    selector: "app-definition-tile",
    templateUrl: "./definition-tile.component.html",
    styleUrls: ["./definition-tile.component.css"]
})
export class DefinitionTileComponent implements OnInit {
    @Input() public item: DisplayedDefinition;
    @Input() public cheatmode: boolean;
    private _gridState: GridState;
    private _style: CSSStyleDeclaration;

    public constructor(el: ElementRef, private _crosswordService: CrosswordService) {
        this._style = el.nativeElement.style;
        this._gridState = new GridState();
    }

    public ngOnInit(): void {
        this._crosswordService.gridStateObs.subscribe((gridState: GridState) => {
            this._gridState = gridState;


        });
    }

    public select(event: MouseEvent): void {
        this._crosswordService.setSelectedWord(this.item.nextId, this.item.orientation);
        event.stopPropagation();
    }

    public hover(): void {
        this._crosswordService.setHoveredWord(this.item.id, this.item.orientation);
    }

    public unHover(): void {
        this._crosswordService.setHoveredWord(null, null);
    }

    public isWordSelected(): boolean {
        let isSelected: boolean = true;
        this.item.letters.forEach((letter: Letter) => {
            if (!(this._crosswordService.playersSelectingLetter(letter.id).length > 0)) {
                isSelected = false;
            }
            if (!(this._crosswordService.playersSelectingLetter(letter.id).length > 1)) {
                this._style.setProperty("--bgColor", this._crosswordService.getPlayerColor(
                    this._crosswordService.playersSelectingLetter(letter.id)[0],
                    true));
            }

        });

        return isSelected;
    }

    public isWordSolved(): boolean {
        this._style.setProperty("--color", this._crosswordService.getPlayerColor(
            this._crosswordService.gameManager.solvedWordPlayer(this.item.id, this.item.orientation),
            false));

        return this._crosswordService.gameManager.isWordSolved(this.item.id, this.item.orientation);
    }
}
