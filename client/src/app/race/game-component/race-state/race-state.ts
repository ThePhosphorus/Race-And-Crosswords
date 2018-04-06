import { RacerState } from "./racer-state";

export class RaceState {

    private _racers: Array<RacerState>;

    public constructor(racersId: Array<number>) {
        racersId.forEach((racerId: number) => {
            this._racers.push( new RacerState(racerId));
        });
    }
    public getRank(id: number): number {
        for (const racer of this._racers) {
            if (racer.id === id) {
                return this._racers.indexOf(racer) + 1;
            }
        }
    }

    public updateRacer(id: number, position: number, currentTime: number): void {
        for (const racer of this._racers) {
            if (racer.id === id) {
                racer.update(position, currentTime);
                this.sortRacers();

                return;
            }
        }
    }
    private sortRacers(): void {
        this._racers.sort((a: RacerState, b: RacerState) => {
            const difference: number = a.currentLap - b.currentLap;

            return difference === 0 ? a.position - b.position : difference;
        });
    }
}
