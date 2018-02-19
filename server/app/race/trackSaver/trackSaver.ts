import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { WebService } from "../../webServices";
import { Track } from "../../../../common/communication/track";
import { DbClient } from "../../mongo/DbClient";
import { Collection, InsertOneWriteOpResult, ReplaceWriteOpResult, ObjectId } from "mongodb";
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

        this._router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
            const id: string = req.params.id;
            const track: Track = req.body["track"];
            this.putTrack(id, track).then((result: ReplaceWriteOpResult) => res.send(result));
        });

        this._router.get("/all", (req: Request, res: Response, next: NextFunction) => {
            this.getAllTracks().then((tracks: Track[]) => res.send(tracks));
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
}
