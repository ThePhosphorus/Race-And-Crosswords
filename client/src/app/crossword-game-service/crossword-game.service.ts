import { Injectable } from "@angular/core";

@Injectable()
export class CrosswordGameService {
    private _solvedWords: number[];

    public constructor() { }

    public get solvedWords(): number[] { return this._solvedWords; }

}
