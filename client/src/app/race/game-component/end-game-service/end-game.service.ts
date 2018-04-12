import { Injectable } from "@angular/core";
import { UserPlayer } from "../player/user-player";
import { AiPlayer } from "../player/ai-player";
import { GameResult } from "./game-result";

@Injectable()
export class EndGameService {

    private _displayResult: boolean;
    private _displayHighscore: boolean;
    private _gameResults: Array<GameResult>;

    public constructor() {
        this._displayResult = false;
        this._displayHighscore = false;
        this._gameResults = new Array<GameResult>();
    }

    public get displayResult(): boolean {
        return this._displayResult;
    }

    public get displayHighscore(): boolean {
        return this._displayHighscore;
    }

    public get gameResults(): Array<GameResult> {
        return this._gameResults;
    }

    public handleEndGame(userPlayer: UserPlayer, aiPlayers: Array<AiPlayer>): void {
        this._gameResults.push(new GameResult(userPlayer.name, false, userPlayer.lapTimes));
        aiPlayers.forEach((ai: AiPlayer) => this._gameResults.push(new GameResult(ai.name, true, ai.lapTimes)));
        this._displayResult = true;
    }
}
