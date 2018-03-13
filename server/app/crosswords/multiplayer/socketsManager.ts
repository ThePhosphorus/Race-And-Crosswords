import * as SockerIO from "socket.io";
import * as http from "http";

const LISTEN_PATH: string = "/socket";

export class SocketsManager {
    private io: SocketIO.Server ;

    public constructor() {
        this.io = null;
    }

    public launch(server: http.Server): void {
        this.io = SockerIO(server, {path : LISTEN_PATH});
        this.setUpbasicEvents();
    }

    private setUpbasicEvents(): void {
        this.io.on("connection", this.createChannel);
    }

    private createChannel(socket: SocketIO.Socket): void {
        console.log("Created Socket:");
        console.log(socket);
    }
}
