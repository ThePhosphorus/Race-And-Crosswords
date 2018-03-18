import { IPlayer } from "../../../../common/communication/Player";
import msg from "../../../../common/communication/socketTypes";
import { CrosswordGrid, Difficulty, Orientation } from "../../../../common/communication/crossword-grid";

type Socket = SocketIO.Socket;

class Player implements IPlayer {
    public constructor (
    public id: number,
    public socket: Socket,
    public name: string
    ) {}
}

export class MatchManager {
    public grid: CrosswordGrid;
    private _players: Array<Player>;
    private _difficulty: Difficulty;

    public constructor(player1: Socket, difficulty: Difficulty) {
        this._players = new Array <Player>();
        this.addPlayer(player1);
        this._difficulty = difficulty;
    }

    public get PlayerOne(): string {
        return this._players[0].name;
    }

    public addPlayer(socket: Socket): void {
        const id: number = this._players.length;
        this._players.push(new Player(id, socket, "Jonh Doe"));
        this.askForName(this._players[id]);
        this.registerActions( socket, id );
    }

    public get difficulty(): Difficulty {
        return this._difficulty;
    }

    private askForName(player: Player): void {
        player.socket.emit(msg.requestName);
    }

    private receiveName(id: number, name: string): void {
        const player: Player = this.getPlayerById(id);
        if (player != null) {
            player.name = name;
        }
    }

    private getPlayerById(id: number): Player {
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

    private registerActions(socket: Socket, id: number): void {
        socket.on(msg.requestName, (name: string) =>
            this.receiveName(id, name));

        socket.on(msg.playerSelectTile, (letterId: number, orientation: Orientation) =>
            this.recieveSelect(id, letterId, orientation));

        socket.on(msg.disconnect, () => this.playerLeave(id));
    }

    public get Players (): Array<IPlayer> {
        return this._players.map((p: Player) => p as IPlayer);
    }

    public recieveSelect(playerId: number, letterId: number, orientation: Orientation ): void {
        this._players.forEach((p: Player, index: number) => {
            if (p.id !== playerId) {
                p.socket.emit(msg.playerSelectTile, letterId, orientation);
            }
        });
    }

    public playerLeave(id: number): void {
        this._players.splice(id, 1);
        this._players.forEach((p: Player, index: number) => {
            if (index !== p.id) {
                p.id = index;
            }
            p.socket.emit(msg.getPlayers, this.Players);
        });

    }

}
