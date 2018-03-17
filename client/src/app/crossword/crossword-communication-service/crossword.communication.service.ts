import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CrosswordGrid, Difficulty } from "../../../../../common/communication/crossword-grid";
import { Observable } from "rxjs/Observable";
import { BACKEND_URL } from "../../global-constants/constants";
import { connect } from "socket.io-client";
import socketMsg from "../../../../../common/communication/socketTypes";

@Injectable()
export class CrosswordCommunicationService {

    private socket: SocketIOClient.Socket;

    public constructor(private http: HttpClient) {
        this.createSocket();
    }

    public getCrossword(difficulty: Difficulty, blackTile: number, size: number): Observable<CrosswordGrid> {
        return this.http.get<CrosswordGrid>(
            BACKEND_URL + "crosswords/grid?" +
            "difficulty=" + difficulty +
            "&size=" + size);
    }
    public getMatches(): Observable<Array<string>> {
        return this.http.get<Array<string>>(BACKEND_URL + "crosswords/multiplayer/matchs");
    }
    public basicServerConnection(): Observable<string> {
        return this.http.get<string>(BACKEND_URL);
    }

    public createSocket(): void {
        this.socket = connect(BACKEND_URL);
    }

    public createMatch(): void {
        this.socket.emit(socketMsg.createMatch);
    }

    public joinMatch(matchName: string): void {
        this.socket.emit(socketMsg.joinMatch, matchName);
    }
}
