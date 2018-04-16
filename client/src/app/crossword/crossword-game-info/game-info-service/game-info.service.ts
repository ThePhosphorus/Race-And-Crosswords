import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class GameInfoService {
    private _showModal: BehaviorSubject<boolean>;
    private _showSearching: BehaviorSubject<boolean>;
    private _showLoading: BehaviorSubject<boolean>;

    public constructor() {
        this._showModal = new BehaviorSubject<boolean>(true);
        this._showSearching = new BehaviorSubject<boolean>(false);
        this._showLoading = new BehaviorSubject<boolean>(true);

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

    public get showLoading(): BehaviorSubject<boolean> {
        return this._showLoading;
    }

    public setShowLoading(bool: boolean): void {
        this._showLoading.next(bool);
    }

}
