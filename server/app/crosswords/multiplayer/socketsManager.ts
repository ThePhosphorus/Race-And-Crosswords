import * as SockerIO from "socket.io";
import * as http from "http";
import { injectable } from "inversify";
import { MatchManager } from "./matchManager";
import msg from "../../../../common/communication/socketTypes";
import { InWaitMatch } from "../../../../common/communication/Match";
import { Difficulty } from "../../../../common/crossword/enums-constants";

type Socket = SocketIO.Socket;

@injectable()
export class SocketsManager {
    private io: SocketIO.Server;
    private _inWaitMatchs: Array<MatchManager>;

    public constructor() {
        this.io = null;
        this._inWaitMatchs = new Array<MatchManager>();
    }

    public launch(server: http.Server): void {
        this.io = SockerIO(server);
        this.setUpbasicEvents();
    }

    private setUpbasicEvents(): void {
        this.io.on(msg.connection, (socket: Socket) => this.addSocket(socket));
    }

    public async createMatch(socket: Socket, diff: Difficulty): Promise<void> {
        const newMatch: MatchManager = new MatchManager(socket, diff);

        await newMatch.getNewGrid();

        this._inWaitMatchs.push(newMatch);
    }

    public joinMatch(socket: Socket, joinName: string): void {
        this._inWaitMatchs.forEach((m: MatchManager, index: number) => {
            if (!m.gotPlayers) {
                this._inWaitMatchs.splice(index, 1);
            } else if (m.PlayerOne === joinName) {
                m.addPlayer(socket);
                socket.emit(msg.getGrid, m.grid);
                this._inWaitMatchs.splice(index, 1);
            }
        });
    }

    public getInWaitMatches(): Array<InWaitMatch> {
        const matchs: Array<InWaitMatch> = new Array<InWaitMatch>();
        this._inWaitMatchs.forEach((m: MatchManager, index: number) => {
            if (!m.gotPlayers) {
                this._inWaitMatchs.splice(index, 1);
            } else if (m.PlayerOne != null) {
                matchs.push(new InWaitMatch(m.PlayerOne, m.difficulty));
            }
        });

        return matchs;
    }

    private addSocket(socket: Socket): void {
        socket.on(msg.createMatch, (diff: Difficulty) => this.createMatch(socket, diff));
        socket.on(msg.joinMatch, (name: string) => this.joinMatch(socket, name));
    }
}
