import * as SockerIO from "socket.io";

type Socket = SocketIO.Socket;
class Player {
    public constructor (
    public id: number,
    public socket: Socket,
    public name: string
    ) {}
}

export class MatchManager {
    private _players: Array<Player>;

    public constructor(player1: Socket) {
        this._players = new Array <Player>();
        this._players.push(new Player(0, player1, null));
    }

    public get PlayerOne(): string {
        return this._players[0].name;
    }

    public addPlayer(socket: Socket): void {
        this._players.push(new Player(this._players.length, socket, null));
        this.askForName(this._players[this._players.length - 1]);
        this.registerActions( socket);
    }

    private askForName(player: Player): void {
        player.socket.emit("AskForName", player.id); // TODO: Mettre des symboles
    }

    private receiveName(data: {id: number, name: string}): void {
        this.getPlayerById(data.id).name = data.name;
    }

    public getPlayerById(id: number): Player {
        // Check if it's at the right place
        if (this._players[id].id === id) {
            return this._players[id];
        } else {
            this._players.forEach((p: Player) => {
                if (p.id === id) { return p; }
            });
        }
    }

    private registerActions(socket: Socket): void {
        socket.on("recieveName", this.receiveName);
    }
}
