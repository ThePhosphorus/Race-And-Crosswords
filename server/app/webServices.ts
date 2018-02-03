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
         if (!this._routingDefined) {
          this.defineRoutes();
          this._routingDefined = true;
         }

         return this._router;
        }

    protected abstract defineRoutes(): void;

    public addSubService(subService: WebService): void {
        this._router.use(subService._routeName, subService._router);
    }
}
