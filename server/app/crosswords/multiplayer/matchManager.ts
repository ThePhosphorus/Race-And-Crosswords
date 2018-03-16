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
        const player: Player = this.getPlayerById(data.id);
        if (player != null) {
            player.name = data.name;
        }
    }

    public getPlayerById(id: number): Player {
        // Check if it's at the right place
        let player: Player = null;
        if (this._players[id].id === id) {
            player = this._players[id];
        } else {
            this._players.forEach((p: Player) => {
                if (p.id === id) { player = p; }
            });
        }

        return player;
    }

    private registerActions(socket: Socket): void {
        socket.on("recieveName", this.receiveName);
    }
}
