import { Injectable } from "@angular/core";
import { UserPlayer } from "../player/user-player";
import { AiPlayer } from "../player/ai-player";
import { GameResult } from "./game-result";
import { NB_LAPS, S_TO_MS, MIN_TO_S } from "../../../global-constants/constants";

const MS_DECIMALS: number = 3;

@Injectable()
export class EndGameService {

    private _displayResult: boolean;
    private _displayHighscore: boolean;
    public gameResults: Array<GameResult>;

    public constructor() {
        this._displayResult = true;
        this._displayHighscore = false;
        this.gameResults = new Array<GameResult>();
    }

    public get displayResult(): boolean {
        return this._displayResult;
    }

    public get displayHighscore(): boolean {
        return this._displayHighscore;
    }

    public handleEndGame(userPlayer: UserPlayer, aiPlayers: Array<AiPlayer>): void {
        this.gameResults.push(new GameResult(userPlayer.name,
                                             false,
                                             this.msToTimes(userPlayer.lapTimes),
                                             this.msToTime(this.sumTimes(userPlayer.lapTimes))));
        aiPlayers.forEach((ai: AiPlayer) => this.gameResults.push(new GameResult(ai.name,
                                                                                 true,
                                                                                 this.msToTimes(ai.lapTimes),
                                                                                 this.msToTime(this.sumTimes(ai.lapTimes)))));
        this.gameResults.sort((a, b) => a.total.localeCompare(b.total));
        this._displayResult = true;
    }

    private sumTimes(times: Array<number>): number {
        let time: number = 0;
        for (let i: number = 0; i < NB_LAPS; i++) {
            time += times[i];
        }

        return time;
    }

    private msToTimes(times: Array<number>): Array<string> {
        const stringArr: Array<string> = new Array<string>();
        times.forEach((ms: number) => stringArr.push(this.msToTime(ms)));

        return stringArr;
    }

    private msToTime(time: number): string {
        const ms: number = time % S_TO_MS;
        time = (time - ms) / S_TO_MS;
        const secs: number = time % MIN_TO_S;
        time = (time - secs) / MIN_TO_S;
        const mins: number = time % MIN_TO_S;

        return ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2) + "." + (ms + "00").substring(0, MS_DECIMALS);
      }
}
