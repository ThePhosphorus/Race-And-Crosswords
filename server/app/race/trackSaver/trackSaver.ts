import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { WebService } from "../../webServices";
import { Track } from "../../../../common/communication/track";
import { DbClient } from "../../mongo/DbClient";
import { Collection, InsertOneWriteOpResult } from "mongodb";
import Types from "../../types";

const TRACK_COLLECTION: string = "tracks";

@injectable()
export class TrackSaver extends WebService {

    private collection: Collection;

    public constructor(@inject(Types.DbClient) private dbClient: DbClient) {
        super();
        this.routeName = "/save";
    }

    private connect(): void {
        if (this.dbClient.db != null) {
            this.collection = this.dbClient.db.collection(TRACK_COLLECTION);
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
        this.connect();

        return this.collection.insertOne(track);
    }
}
