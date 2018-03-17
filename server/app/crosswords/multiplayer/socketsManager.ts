import * as SockerIO from "socket.io";
import * as http from "http";
import { injectable } from "inversify";
import { MatchManager } from "./matchManager";
import msg from "../../../../common/communication/socketTypes";

type Socket = SocketIO.Socket;

@injectable()
export class SocketsManager {
    private io: SocketIO.Server ;
    private _matchs: Array<MatchManager>;

    public constructor() {
        this.io = null;
        this._matchs = new Array<MatchManager>();
    }

    public launch(server: http.Server): void {
        this.io = SockerIO(server);
        this.setUpbasicEvents();
    }

    private setUpbasicEvents(): void {
        this.io.on(msg.connection, (socket: Socket) => this.addSocket(socket));
    }

    public createMatch(socket: Socket): void {
        this._matchs.push(new MatchManager(socket));
    }

    public joinMatch(socket: Socket, joinName: string): void {
        this._matchs.forEach((m: MatchManager, index: number) => {
            if (m.PlayerOne === joinName) {
                m.addPlayer(socket);
                this._matchs.slice(index, 1);
            }
        });
    }

    public getNames(): Array<string> {
        const names: Array<string> = new Array<string>();
        this._matchs.forEach((m: MatchManager) => {
            if (m.PlayerOne != null) {
                names.push(m.PlayerOne);
            }
        });

        return names;
    }

    private addSocket(socket: Socket): void {
        socket.on(msg.createMatch, () => this.createMatch(socket) );
        socket.on(msg.joinMatch, (name: string) => this.joinMatch(socket, name));
    }
}
