import { Component, Input, ElementRef } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { DisplayedDefinition } from "../definition/definition.component";

@Component({
    selector: "app-definition-tile",
    templateUrl: "./definition-tile.component.html",
    styleUrls: ["./definition-tile.component.css"]
})
export class DefinitionTileComponent {
    @Input() public item: DisplayedDefinition;
    @Input() public cheatmode: boolean;
    private style: CSSStyleDeclaration;

    public constructor(el: ElementRef, private _crosswordService: CrosswordService) {
        this.style = el.nativeElement.style;
    }

    public select(event: MouseEvent): void {
        this._crosswordService.setSelectedWord(this.item.id, this.item.orientation);
        event.stopPropagation();
    }

    public hover(): void {
        this._crosswordService.setHoveredWord(this.item.id, this.item.orientation);
    }

    public unHover(): void {
        this._crosswordService.setHoveredWord(null, null);
    }

    public isWordSolved(): boolean {
        this.style.setProperty("--color", this._crosswordService.getPlayerColor(
                                            this._crosswordService.gameManager.solvedWordPlayer(this.item.id, this.item.orientation),
                                            false));

        return this._crosswordService.gameManager.isWordSolved(this.item.id, this.item.orientation);
    }
}
