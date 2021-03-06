import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BACKEND_URL } from "../../global-constants/constants";
import { connect } from "socket.io-client";
import socketMsg from "../../../../../common/communication/socketTypes";
import { InWaitMatch } from "../../../../../common/communication/Match";
import { Player } from "../../../../../common/communication/Player";
import { Difficulty, Orientation } from "../../../../../common/crossword/enums-constants";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Word } from "../../../../../common/crossword/word";

const DEFAULT_NAME: string = "John C Doe";

export interface SocketToServerInfos {
    receivePlayersCallBack: Function;
    receiveSelectCallBack: Function;
    receiveGrid: Function;
    receiveIsCompletedWord: Function;
    returnName: string;
}

@Injectable()
export class CrosswordCommunicationService {

    private socket: SocketIOClient.Socket;
    private socketInfos: SocketToServerInfos;

    public constructor(private http: HttpClient) {
        this.createSocket();
        this.socketInfos = {receivePlayersCallBack : null,
                            receiveSelectCallBack : null,
                            receiveGrid : null,
                            receiveIsCompletedWord : null,
                            returnName : DEFAULT_NAME};
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

        this.socket.on(socketMsg.getPlayers, (players: Array<Player>) =>
            this.execute(this.socketInfos.receivePlayersCallBack, players));

        this.socket.on(socketMsg.playerSelectTile, (playerId: number, letterId: number, orientation: Orientation) =>
            this.execute(this.socketInfos.receiveSelectCallBack, playerId, letterId, orientation));

        this.socket.on(socketMsg.getGrid, (grid: CrosswordGrid) =>
            this.execute(this.socketInfos.receiveGrid, this.realGrid(grid)));

        this.socket.on(socketMsg.completedWord, (playerId: number, word: Word) =>
            this.execute(this.socketInfos.receiveIsCompletedWord, playerId, word));
    }

    public rematch(): void {
        this.socket.emit(socketMsg.rematch);
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

    public set listenerPlayersReceived(func: Function) {
        this.socketInfos.receivePlayersCallBack = func;
    }

    public set listenerWordSelected(func: Function) {
        this.socketInfos.receiveSelectCallBack = func;
    }

    public set listenerGridReceived(func: Function) {
        this.socketInfos.receiveGrid = func;
    }

    public set listenerWordSolved(func: Function) {
        this.socketInfos.receiveIsCompletedWord = func;
    }

    public set returnName(name: string) {
        this.socketInfos.returnName = name;
    }

    public get returnName(): string {
        return this.socketInfos.returnName;
    }

    public notifySelect(letterId: number, orientation: Orientation): void {
        this.socket.emit(socketMsg.playerSelectTile, letterId, orientation);
    }

    public leaveGame(): void {
        this.socket.emit(socketMsg.leaveGame);
    }

    public completedWord(w: Word): void {
        this.socket.emit(socketMsg.completedWord, w);
    }

    private execute(func: Function, ...args: {}[]): void {
        if (func != null) { func(...args); }
    }

    private realGrid(sgrid: CrosswordGrid): CrosswordGrid { // For some reason the Crossword that we get isn't a real object (it's in JSON)
        return JSON.parse("" + sgrid);
    }
}
