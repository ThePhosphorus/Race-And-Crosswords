import * as SockerIO from "socket.io";
import * as http from "http";
import { injectable } from "inversify";
import { MatchManager } from "./matchManager";
import msg from "../../../../common/communication/socketTypes";
import { Difficulty } from "../../../../common/communication/crossword-grid";
import { InWaitMatch } from "../../../../common/communication/Match";

type Socket = SocketIO.Socket;

@injectable()
export class SocketsManager {
    private io: SocketIO.Server ;
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

    public createMatch(socket: Socket, diff: Difficulty): void {
        this._inWaitMatchs.push(new MatchManager(socket, diff));
    }

    public joinMatch(socket: Socket, joinName: string): void {
        this._inWaitMatchs.forEach((m: MatchManager, index: number) => {
            if (m.PlayerOne === joinName) {
                m.addPlayer(socket);
                this._inWaitMatchs.slice(index, 1);
            }
        });
    }

    public getInWaitMatches(): Array<InWaitMatch> {
        const names: Array<InWaitMatch> = new Array<InWaitMatch>();
        this._inWaitMatchs.forEach((m: MatchManager) => {
            if (m.PlayerOne != null) {
                names.push(new InWaitMatch(m.PlayerOne, m.difficulty));
            }
        });

        return names;
    }

    private addSocket(socket: Socket): void {
        socket.on(msg.createMatch, (diff: Difficulty) => this.createMatch(socket, diff) );
        socket.on(msg.joinMatch, (name: string) => this.joinMatch(socket, name));
    }
}
