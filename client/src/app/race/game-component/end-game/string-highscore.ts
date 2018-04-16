import { S_TO_MS, MIN_TO_S } from "../../../global-constants/constants";
import { Highscore } from "../../../../../../common/race/highscore";

const MS_DECIMALS: number = 3;

export class StringHighscore {
    public name: string;
    public time: string;

    public constructor (highscore: Highscore) {
        this.name = highscore.name;
        this.time = StringHighscore.msToTime(highscore.time);
    }

    public static msToTime(time: number): string {
        const ms: number = time % S_TO_MS;
        time = (time - ms) / S_TO_MS;
        const secs: number = time % MIN_TO_S;
        time = (time - secs) / MIN_TO_S;
        const mins: number = time % MIN_TO_S;

        return ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2) + "." + (ms + "00").substring(0, MS_DECIMALS);
    }
}
