export class RacerState {

    private _finishedLap: number;
    private _position: number;
    private _lapTimes: number[];

    public constructor( private _id: number) {
        this._finishedLap = 0;
        this._position = 0;
        this._lapTimes = new Array<number>();
        this._lapTimes.push(0);
    }
    public get currentLap(): number {
        return this._finishedLap + 1;
    }
    public get lapTimes(): Array<number> {
        return this._lapTimes;
    }
    public get position(): number {
        return this.position;
    }
    public update(position: number, time: number): void {
        this._lapTimes[this._finishedLap] = time;
        this._position = position;
    }

    public newLap(): void {
        this._finishedLap++;
        this._lapTimes.push(0);
    }

}
