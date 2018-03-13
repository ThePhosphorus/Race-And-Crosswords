import * as SockerIO from "socket.io";
import * as http from "http";
import { injectable } from "inversify";

@injectable()
export class SocketsManager {
    private io: SocketIO.Server ;

    public constructor() {
        this.io = null;
    }

    public launch(server: http.Server): void {
        this.io = SockerIO(server);
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
