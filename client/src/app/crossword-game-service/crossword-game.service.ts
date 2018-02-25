import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

@Injectable()
export class CrosswordGameService {
    private _solvedWords: number[];

    public constructor() { }

    public get solvedWords(): Observable<number[]> { return of(this._solvedWords); }

    public addSolvedWord(index: number): void {
        this._solvedWords.push(index);
    }
}
