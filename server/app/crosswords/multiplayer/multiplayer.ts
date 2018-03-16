import { WebService } from "../../webServices";
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import Types from "../../types";
import { SocketsManager } from "./socketsManager";

@injectable()
export class Multiplayer extends WebService {

    public constructor(@inject(Types.SocketsManager) private socketManager: SocketsManager) {
        super();
        this.routeName = "/multiplayer";
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => res.send("Multiplayer End point!"));

        this._router.get("/matchs", (req: Request, res: Response, next: NextFunction) => res.send(this.socketManager.getNames()));

    }
}
