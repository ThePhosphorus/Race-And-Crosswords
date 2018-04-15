import { Directive, Input, AfterContentChecked, ElementRef } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";

const COLOR_1: number = 0;
const COLOR_2: number = 1;
const BG_COLOR: number = 2;

@Directive({
    selector: "[appTileColor]"
})
export class TileColorDirective implements AfterContentChecked {
    @Input() private letterId: number;
    @Input() private isDisabled: boolean;

    private style: CSSStyleDeclaration;

    public constructor(el: ElementRef, private _crosswordService: CrosswordService) {
        this.style = el.nativeElement.style;
    }

    public ngAfterContentChecked(): void {
        this.clearColors();
        const colors: string[] = this.colors;

        if (colors[COLOR_1] != null) {
            this.style.setProperty("--color", colors[COLOR_1]);
            this.style.setProperty("--bgColor", colors[BG_COLOR]);

            if (colors[COLOR_2] != null) {
                this.style.setProperty("--color2", colors[COLOR_2]);
            }
        }
    }

    private get colors(): string[] {
        const colors: Array<string> = new Array<string>();
        const players: number[] = (this.isDisabled) ?
            this._crosswordService.playersDisablingLetter(this.letterId) :
            this._crosswordService.playersSelectingLetter(this.letterId);

        if (players.length > 0) {
            colors[COLOR_1] = this._crosswordService.getPlayerColor(
                players[0],
                !this.isDisabled
            );
            colors[BG_COLOR] = this._crosswordService.getPlayerColor(
                players[0],
                this.isDisabled
            );

            if (players.length > 1) {
                colors[COLOR_2] = this._crosswordService.getPlayerColor(
                    players[1],
                    !this.isDisabled
                );
            }
        }

        return colors;
    }

    private clearColors(): void {
        this.style.setProperty("--color", null);
        this.style.setProperty("--color2", null);
        this.style.setProperty("--bgColor", null);
    }
}
