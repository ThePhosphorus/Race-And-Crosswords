import { MIN_TO_S, S_TO_MS } from "../../global-constants/constants";

const MS_TO_CS: number = 10;
const S_TO_CS: number = 100;
export class Timer {
    private _minutes: number;
    private _seconds: number;
    private _centiseconds: number;
    public constructor() {
        this.initNumbers();
    }

    private initNumbers(): void {
        this._centiseconds = 0;
        this._seconds = 0;
        this._minutes = 0;
    }

    public update(t: number): void {
        this._centiseconds += (t / MS_TO_CS) % S_TO_CS;
        this._seconds += Math.floor(t / S_TO_MS) % MIN_TO_S;
        this._minutes += Math.floor( t / (S_TO_MS * MIN_TO_S));
        if (this._centiseconds >= S_TO_CS) {
            this._centiseconds -= S_TO_CS;
            this._seconds++;
            if (this._seconds >= MIN_TO_S) {
                this._seconds -= MIN_TO_S;
                this._minutes++;
            }

        }
    }

    public reset(): void {
        this.initNumbers();
    }

    public get minutes(): number {
        return this._minutes;
    }

    public get seconds(): number {
        return this._seconds;
    }

    public get centiseconds(): number {
        return this._centiseconds;
    }
}
