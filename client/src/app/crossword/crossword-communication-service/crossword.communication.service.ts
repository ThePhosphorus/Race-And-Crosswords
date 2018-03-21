import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CrosswordGrid, Difficulty, Orientation, Word } from "../../../../../common/communication/crossword-grid";
import { Observable } from "rxjs/Observable";
import { BACKEND_URL } from "../../global-constants/constants";
import { connect } from "socket.io-client";
import socketMsg from "../../../../../common/communication/socketTypes";
import { InWaitMatch } from "../../../../../common/communication/Match";
import { IPlayer } from "../../../../../common/communication/Player";

export class SocketToServerInfos {
    public constructor(
        public receivePlayersCallBack: Function,
        public receiveSelectCallBack: Function,
        public receiveGrid: Function,
        public receiveCompletedWord: Function,
        public returnName: string

    ) { }
}

@Injectable()
export class CrosswordCommunicationService {

    private socket: SocketIOClient.Socket;
    private socketInfos: SocketToServerInfos;

    public constructor(private http: HttpClient) {
        this.createSocket();
        this.socketInfos = new SocketToServerInfos(null, null, null, null, "John C Doe");
    }

    public getCrossword(difficulty: Difficulty, blackTile: number, size: number): Observable<CrosswordGrid> {
        return this.http.get<CrosswordGrid>(
            BACKEND_URL + "crosswords/grid?" +
            "difficulty=" + difficulty +
            "&size=" + size);
    }
    public getMatches(): Observable<Array<InWaitMatch>> {
        return this.http.get<Array<InWaitMatch>>(BACKEND_URL + "crosswords/multiplayer/matchs");
    }
    public basicServerConnection(): Observable<string> {
        return this.http.get<string>(BACKEND_URL);
    }

    public createSocket(): void {
        this.socket = connect(BACKEND_URL);

        this.socket.on(socketMsg.requestName, (id: number) =>
            this.socketReturnName(id));

        this.socket.on(socketMsg.getPlayers, (players: Array<IPlayer>) =>
            this.execute(this.socketInfos.receivePlayersCallBack, players));

        this.socket.on(socketMsg.playerSelectTile, (playerId: number, letterId: number, orientation: Orientation) =>
            this.execute(this.socketInfos.receiveSelectCallBack, playerId, letterId, orientation));

        this.socket.on(socketMsg.getGrid, (grid: CrosswordGrid) => {
            this.execute(this.socketInfos.receiveGrid, this.realGrid(grid));
        });

        this.socket.on(socketMsg.updateWord, (w: Word) =>
            this.execute(this.socketInfos.receiveCompletedWord, w));
    }

    public createMatch(difficulty: Difficulty): void {
        this.socket.emit(socketMsg.createMatch, difficulty);
    }

    public joinMatch(matchName: string): void {
        this.socket.emit(socketMsg.joinMatch, matchName);
    }

    private socketReturnName(id: number): void {
        this.socket.emit(socketMsg.requestName, this.socketInfos.returnName);
    }

    public set listenerReceivePlayers(func: Function) {
        this.socketInfos.receivePlayersCallBack = func;
    }

    public set listenerReceiveSelect(func: Function) {
        this.socketInfos.receiveSelectCallBack = func;
    }

    public set listenerReceiveGrid(func: Function) {
        this.socketInfos.receiveGrid = func;
    }

    public set listenerReceiveCompletedWord(func: Function) {
        this.socketInfos.receiveCompletedWord = func;
    }

    public set returnName(name: string) {
        this.socketInfos.returnName = name;
    }

    public notifySelect(letterId: number, orientation: Orientation): void {
        this.socket.emit(socketMsg.playerSelectTile, letterId, orientation);
    }

    private execute(func: Function, ...args: {}[]): void {
        if (func != null) { func(...args); }
    }

    private realGrid(sgrid: CrosswordGrid): CrosswordGrid { // For some reason the Crossword that we get isn't a real object (it's in JSON)
        return JSON.parse("" + sgrid);
    }

}
