import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export abstract class WebService {

    protected _routerName: string;

    public get routeName(): string { return this._routerName; }

    public abstract get routes(): Router;
}
