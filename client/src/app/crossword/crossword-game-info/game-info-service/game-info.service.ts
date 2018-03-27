import { Injectable } from "@angular/core";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Difficulty } from "../../../../../../common/crossword/enums-constants";

@Injectable()
export class GameInfoService {
    private _showModal: BehaviorSubject<boolean>;
    private _showSearching: BehaviorSubject<boolean>;
    private _lvl: BehaviorSubject<Difficulty>;

    public constructor(private _crosswordService: CrosswordService) {
        this._showModal = new BehaviorSubject<boolean>(true);
        this._showSearching = new BehaviorSubject<boolean>(false);
        this._lvl = new BehaviorSubject<Difficulty>(null);
        this._crosswordService.difficulty.subscribe((difficulty: Difficulty) =>
        this.setLvl(difficulty));
    }
    public configureNewGame(): void {
        this._crosswordService.isGameOver = false;
    }
    public get showModal(): BehaviorSubject<boolean> {
        return this._showModal;
    }
    public setShowModal(bool: boolean): void {
        this._showModal.next(bool);
    }
    public get showSearching(): BehaviorSubject<boolean> {
        return this._showSearching;
    }
    public setShowSearching(bool: boolean): void {
        this._showSearching.next(bool);
    }
    public get lvl(): BehaviorSubject<Difficulty> {
        return this._lvl;
    }
    public setLvl(diff: Difficulty): void {
        this._lvl.next(diff);
    }

}
