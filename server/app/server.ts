import { Application } from "./app";
import * as http from "http";
import Types from "./types";
import { injectable, inject } from "inversify";
import { IServerAddress } from "./iserver.address";

@injectable()
export class Server {

    private readonly _appPort: string|number|boolean = this.normalizePort(process.env.PORT || "3000");
    private readonly _baseDix: number = 10;
    private _server: http.Server;

    constructor(@inject(Types.Application) private application: Application) { }

    public init(): void {
        this.application.app.set("port", this._appPort);

        this._server = http.createServer(this.application.app);

        this._server.listen(this._appPort);
        this._server.on("error", (error: NodeJS.ErrnoException) => this.onError(error));
        this._server.on("listening", () => this.onListening());
    }

    private normalizePort(val: number | string): number | string | boolean {
        const port: number = (typeof val === "string") ? parseInt(val, this._baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== "listen") { throw error; }
        const bind: string = (typeof this._appPort === "string") ? "Pipe " + this._appPort : "Port " + this._appPort;
        switch (error.code) {
            case "EACCES":
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Se produit lorsque le serveur se met à écouter sur le port.
     */
    private  onListening(): void {
        const addr: IServerAddress = this._server.address();
        const bind: string = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
        // tslint:disable-next-line:no-console
        console.log(`Listening on ${bind}`);
    }
}
