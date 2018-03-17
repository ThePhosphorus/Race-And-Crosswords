import * as SockerIO from "socket.io";
import * as http from "http";
import { injectable } from "inversify";
import { MatchManager } from "./matchManager";
import msg from "../../../../common/communication/socketTypes";

@injectable()
export class SocketsManager {
    private io: SocketIO.Server ;
    private _matchs: Array<MatchManager>;
    private sockets: Array<SocketIO.Socket> ;

    public constructor() {
        this.io = null;
        this._matchs = new Array<MatchManager>();
        this.sockets = new Array<SocketIO.Socket>();
    }

    public launch(server: http.Server): void {
        this.io = SockerIO(server);
        this.setUpbasicEvents();
    }

    private setUpbasicEvents(): void {
        this.io.on("Connection", this.addSocket);
        this.io.on(msg.createMatch.toString(), this.createMatch);
        this.io.on(msg.joinMatch.toString(), this.joinMatch);
    }

    private createMatch(socket: SocketIO.Socket): void {
        this._matchs.push(new MatchManager(socket));
    }

    private joinMatch(socket: SocketIO.Socket, joinName: string): void {
        this._matchs.forEach((m: MatchManager) => {
            if (m.PlayerOne === joinName) {
                m.addPlayer(socket);
            }
        });
    }

    public getNames(): Array<string> {
        console.log(this._matchs);
        const names: Array<string> = new Array<string>();
        this._matchs.forEach((m: MatchManager) => {
            if (m.PlayerOne != null) {
                names.push(m.PlayerOne);
            }
        });

        return names;
    }

    public addSocket(socket: SocketIO.Socket): void {
        this.sockets.push(socket);
    }
}
