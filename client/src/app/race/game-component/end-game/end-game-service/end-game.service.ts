import { Injectable } from "@angular/core";
import { UserPlayer } from "../../player/user-player";
import { AiPlayer } from "../../player/ai-player";
import { GameResult } from "./game-result";
import { NB_LAPS } from "../../../../global-constants/constants";
import { Track } from "../../../../../../../common/race/track";
import { Highscore } from "../../../../../../../common/race/highscore";
import { TrackLoaderService } from "../../../track-loader/track-loader.service";
import { StringHighscore } from "../string-highscore";

const MAX_SAVED_HIGHSCORES: number = 5;

@Injectable()
export class EndGameService {

    private _displayResult: boolean;
    private _displayHighscore: boolean;
    private _displayHighscoreAdder: boolean;
    private _track: Track;
    private _player: UserPlayer;
    public gameResults: Array<GameResult>;

    public constructor(private _trackLoader: TrackLoaderService) {
        this._displayResult = false;
        this._displayHighscore = false;
        this._player = null;
        this.gameResults = new Array<GameResult>();
    }

    public get trackHighscores(): Array<Highscore> {
        return this._track.highscores;
    }

    public get displayResult(): boolean {
        return this._displayResult;
    }

    public get displayHighscore(): boolean {
        return this._displayHighscore;
    }

    public get displayHighscoreAdder(): boolean {
        return this._displayHighscoreAdder;
    }

    public handleEndGame(userPlayer: UserPlayer, aiPlayers: Array<AiPlayer>, track: Track): void {
        if (userPlayer != null) {
            this._player = userPlayer;
            this.gameResults.push(new GameResult(userPlayer.name,
                                                 false,
                                                 this.msToTimes(userPlayer.lapTimes),
                                                 StringHighscore.msToTime(this.sumTimes(userPlayer.lapTimes))));
        }
        if (aiPlayers != null) {
            aiPlayers.forEach((ai: AiPlayer) => {
                this.gameResults.push(new GameResult(ai.name,
                                                     true,
                                                     this.msToTimes(ai.lapTimes),
                                                     StringHighscore.msToTime(this.sumTimes(ai.lapTimes)))
                );
            });
        }

        this.gameResults.sort((a, b) => a.total.localeCompare(b.total));
        this._displayResult = true;
        this._track = track;
    }

    public closeResult(): void {
        this._displayResult = false;
        if (!this.gameResults[0].isAi && this.isNewHighscore(this.sumTimes(this._player.lapTimes))) {
            this._displayHighscoreAdder = true;
        } else {
            this._displayHighscore = true;
        }
    }

    public closeHighscoreAdder(): void {
        this._displayHighscoreAdder = false;
        this._displayHighscore = true;
    }

    public addHighscore(name: string): void {
        this._trackLoader.updateHighScore(this._track._id, new Highscore(name, this.sumTimes(this._player.lapTimes))).subscribe(() => {
            this.reloadTrack(this._track._id);
        });
    }

    private reloadTrack(id: string): void {
        this._trackLoader.loadOne(id).subscribe((track: Track) => {
            this._track = track;
        });
    }

    private isNewHighscore(time: number): boolean {
        if (this.trackHighscores == null ||
            this.trackHighscores.length <= MAX_SAVED_HIGHSCORES) {
            return true;
        }
        for (const highscore of this._track.highscores) {
            if (time < highscore.time) {
                return true;
            }
        }

        return false;
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
        times.forEach((ms: number) => stringArr.push(StringHighscore.msToTime(ms)));

        return stringArr;
    }
}
