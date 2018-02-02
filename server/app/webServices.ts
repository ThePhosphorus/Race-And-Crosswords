import { Router } from "express";

export abstract class WebService {
    constructor (
        protected _routerName: string,
        protected _router?: Router
    ) {
        if (_router == null) {
            _router = Router();
        }
    }

    public get router (): Router { return this._router; }

    public get routeName(): string { return this._routerName; }

    public addSubService(subService: WebService): void {
        this._router.use(subService._routerName, subService.router);
    }

    protected abstract routes(): void;
}
