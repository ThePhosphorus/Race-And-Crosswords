import { Injectable } from "@angular/core";

@Injectable()
export class EndGameService {

    private _displayResult: boolean;
    private _displayHighscore: boolean;

    public constructor() {
        this._displayResult = false;
        this._displayHighscore = false;
    }

    public get displayResult(): boolean {
        return this._displayResult;
    }

    public get displayHighscore(): boolean {
        return this._displayHighscore;
    }

    public handleEndGame(): void {
        this._displayResult = true;
    }

}
