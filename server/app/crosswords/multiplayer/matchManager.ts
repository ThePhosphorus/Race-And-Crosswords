import { Player } from "../../../../common/communication/Player";
import msg from "../../../../common/communication/socketTypes";
import { CrosswordGrid, Difficulty, Orientation, Word } from "../../../../common/communication/crossword-grid";

type Socket = SocketIO.Socket;

class SPlayer extends Player {
    public constructor(
        public id: number,
        public name: string,
        public score: number,
        public socket: Socket
    ) {
        super(id, name, score);
     }
}

export class MatchManager {
    public grid: CrosswordGrid;
    private _players: Array<SPlayer>;
    private _difficulty: Difficulty;
    private completedWords: Array<Word>;

    public constructor(player1: Socket, difficulty: Difficulty) {
        this._players = new Array<SPlayer>();
        this.completedWords = new Array<Word>();
        this.addPlayer(player1);
        this._difficulty = difficulty;
    }

    public get PlayerOne(): string {
        return this._players[0].name;
    }

    public get gotPlayers(): boolean {
        return this._players.length > 0;
    }

    public addPlayer(socket: Socket): void {
        const id: number = this._players.length;
        this._players.push(new SPlayer(id, "Jonh Doe", 0, socket));
        this.registerActions(socket, id);
        this.askForName(this._players[id]);
    }

    public get difficulty(): Difficulty {
        return this._difficulty;
    }

    private askForName(player: SPlayer): void {
        player.socket.emit(msg.requestName);
    }

    private receiveName(id: number, name: string): void {
        const player: SPlayer = this.getPlayerById(id);
        if (player != null) {
            player.name = name;
            this.notifyAll(msg.getPlayers, this.Players);
        }
    }

    private getPlayerById(id: number): SPlayer {
        // Check if it's at the right place
        let player: SPlayer = null;
        if (this._players[id].id === id) {
            player = this._players[id];
        } else {
            this._players.forEach((p: SPlayer) => {
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
        socket.on(msg.completedWord, (w: Word) => this.verifyFirst(w, id));
    }

    public verifyFirst(w: Word, playerId: number): void {
        let confirmWord: boolean = true;
        this.completedWords.forEach((word: Word) => {
            if (word === w) {
                confirmWord = false;
            }
        });
        this.getPlayerById(playerId).socket.emit(msg.completedWord, confirmWord);
        if (confirmWord) {
            this.completedWords.push(w);
            this.notifyOthers(playerId, msg.updateWord, w);
        }
    }
    public notifyOthers(playerId: number, socketMsg: string, ...args: {}[]): void {
        this._players.forEach((p: SPlayer) => {
            if (p.id !== playerId) {
                p.socket.emit(socketMsg, ...args);
            }
        });
    }

    public notifyAll(socketMsg: string, ...args: {}[]): void {
        this._players.forEach((p: SPlayer) => p.socket.emit(socketMsg, ...args));
    }

    public get Players(): Array<Player> {
        return this._players.map((sp: SPlayer) => new Player(sp.id, sp.name, sp.score));
    }

    public recieveSelect(playerId: number, letterId: number, orientation: Orientation): void {
            this.notifyOthers(playerId, msg.playerSelectTile, letterId, orientation);
    }

    public playerLeave(id: number): void {
        this._players.splice(id, 1);
        this.notifyOthers(id, msg.getGrid, this.Players);

    }

}
