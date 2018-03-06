
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

    public update(): void {
        this._centiseconds++;
        if (this._centiseconds >= 100) {
            this._centiseconds = 0;
            this._seconds++;
            if (this._seconds >= 60) {
                this._seconds = 0;
                this._minutes++;
            }

        }
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
