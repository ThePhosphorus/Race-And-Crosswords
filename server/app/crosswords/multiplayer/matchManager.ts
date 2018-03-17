import { IPlayer } from "../../../../common/communication/Player";
import msg from "../../../../common/communication/socketTypes";

type Socket = SocketIO.Socket;

class Player implements IPlayer {
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
        this.addPlayer(player1);
    }

    public get PlayerOne(): string {
        return this._players[0].name;
    }

    public addPlayer(socket: Socket): void {
        console.log("Player added");

        this._players.push(new Player(this._players.length, socket, "defaultName"));
        this.askForName(this._players[this._players.length - 1]);
        this.registerActions( socket);
    }

    private askForName(player: Player): void {
        player.socket.emit(msg.askForName, player.id);
        console.log("request name sent");

    }

    private receiveName(id: number, name: string): void {
        console.log("received name is " + name);
        const player: Player = this.getPlayerById(id);
        if (player != null) {
            player.name = name;
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
        socket.on(msg.receiveName, (id: number, name: string) => this.receiveName(id, name));
    }

    public get Players (): Array<Player> {
        return this._players;
    }
}
