import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { WebService } from "../../webServices";
import { Track } from "../../../../common/communication/track";
import { DbClient } from "../../mongo/DbClient";
import { Collection, InsertOneWriteOpResult, ReplaceWriteOpResult, ObjectId, DeleteWriteOpResultObject } from "mongodb";
import Types from "../../types";

const TRACK_COLLECTION: string = "tracks";

@injectable()
export class TrackSaver extends WebService {

    private dbClient: DbClient;
    private collection: Collection;

    public constructor() {
        super();
        this.dbClient = new DbClient();
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

        this._router.get("/all", (req: Request, res: Response, next: NextFunction) => {
            this.getAllTracks().then((tracks: Track[]) => res.send(tracks));
        });

        this._router.post("/", (req: Request, res: Response, next: NextFunction) => {
            const track: Track = req.body["track"];
            this.postTrack(track).then( (result: InsertOneWriteOpResult) => res.send(result));
        });

        this._router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
            const id: string = req.params.id;
            const track: Track = req.body["track"];
            this.putTrack(id, track).then((result: ReplaceWriteOpResult) => res.send(result));
        });

        this._router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
            const id: string = req.params.id;
            this.deleteTrack(id).then((result: DeleteWriteOpResultObject) => res.send(result));
        });
    }

    private postTrack(track: Track): Promise<InsertOneWriteOpResult> {
        this.connect();
        track._id = undefined;

        return this.collection.insertOne(track);
    }

    private putTrack(id: string, track: Track): Promise<ReplaceWriteOpResult> {
        this.connect();

        return this.collection.replaceOne({_id : new ObjectId(id)}, track);
    }

    private getAllTracks(): Promise<Track[]> {
        this.connect();

        return this.collection.find({}).toArray();
    }

    private deleteTrack(id: string): Promise<DeleteWriteOpResultObject> {
        this.connect();

        return this.collection.deleteOne({_id: new ObjectId(id)});
    }
}
