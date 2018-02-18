import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { WebService } from "../../webServices";
import { Track } from "../../../../common/communication/track";
import { DbClient } from "../../mongo/DbClient";
import { Collection, InsertOneWriteOpResult } from "mongodb";
import Types from "../../types";

const TRACK_COLLECTION: string = "track";

@injectable()
export class TrackSaver extends WebService {

    private collection: Collection;

    public constructor(@inject(Types.DbClient) private dbClient: DbClient) {
        super();
        this.routeName = "/save";
        if (this.dbClient.db) {
            this.collection = this.dbClient.db.collection(TRACK_COLLECTION);
        } else {
            console.log("db is not initialised");
        }
    }

    protected defineRoutes(): void {
        this._router.get("/",  (req: Request, res: Response, next: NextFunction) => {
            res.send("TrackSaver End Point");
        });

        this._router.post("/", (req: Request, res: Response, next: NextFunction) => {
            const track: Track = req.body["track"];
            this.postTrack(track).then( (result: InsertOneWriteOpResult) => res.send(result));
        });
    }

    private postTrack(track: Track): Promise<InsertOneWriteOpResult> {
        return this.collection.insert(track);
    }
}
