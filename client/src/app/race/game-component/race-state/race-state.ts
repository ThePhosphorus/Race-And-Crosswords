import { RacerState } from "./racer-state";

export class RaceState {

    private _racers: Array<RacerState>;

    private sortRacers(): void {
        this._racers.sort((a: RacerState, b: RacerState) => {
            const difference: number = a.currentLap - b.currentLap;

            return difference === 0 ? a.position - b.position : difference;
        });
    }
}
