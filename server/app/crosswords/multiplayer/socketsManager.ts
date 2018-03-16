import * as SockerIO from "socket.io";
import * as http from "http";
import { injectable } from "inversify";
import { MatchManager } from "./matchManager";

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
        this.io.on("createMatch", this.createMatch);
        this.io.on(, this.joinMatch);
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
        const names: Array<string> = new Array<string>();
        this._matchs.forEach((m: MatchManager) => {
            if (m.PlayerOne != null) {
                names.push(m.PlayerOne);
            }
        });

        return names;
    }
}
