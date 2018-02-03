import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export abstract class WebService {

    protected _router: Router;
    private _routeName: string;
    private _routingDefined: boolean;

    public constructor() {
        this._router = Router();
        this._routeName = "/";
        this._routingDefined = false;
    }

    public set routeName(routeName: string) { this._routeName = routeName; }

    public get routeName(): string { return this._routeName; }

    public get routes(): Router {
        this.initRoutes();

        return this._router;
        }

    private initRoutes(): void {
        if (!this._routingDefined) {
            this.defineRoutes();
            this._routingDefined = true;
           }
    }

    protected abstract defineRoutes(): void;

    protected addSubService(subService: WebService): void {
        this._router.use(subService.routeName, subService.routes);
    }
}
