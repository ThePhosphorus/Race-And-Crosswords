import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { WebService } from "../../webServices";
import { Track } from "../../../../common/race/track";
import { DbClient } from "../../mongo/DbClient";
import { Highscore } from "../../../../common/race/highscore";
import {
    Collection,
    InsertOneWriteOpResult,
    ObjectId,
    DeleteWriteOpResultObject,
    UpdateWriteOpResult
} from "mongodb";

const TRACK_COLLECTION: string = "tracks";
const MAX_NUMBER_OF_HIGHSCORES: number = 5;

@injectable()
export class TrackSaver extends WebService {

    private _dbClient: DbClient;
    private _collection: Collection;

    public constructor() {
        super();
        this._dbClient = new DbClient();
        this.routeName = "/saver";
    }

    private connect(): void {
        if (this._dbClient.db != null) {
            this._collection = this._dbClient.db.collection(TRACK_COLLECTION);
        }
    }

    protected defineRoutes(): void {
        this.getReq();
        this.postReq();
        this.putReq();
        this.deleteReq();
    }

    private getReq(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("TrackSaver End Point");
        });

        this._router.get("/all", (req: Request, res: Response, next: NextFunction) => {
            this.getAllTracks().then((tracks: Track[]) => res.send(tracks))
                               .catch((e: Error) => this.errorhandler(e));
        });

        this._router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
            const id: string = req.params.id;
            this.getTrack(id).then((track: Track) => res.send(track))
                             .catch((e: Error) => this.errorhandler(e));
        });
    }

    private putReq(): void {
        this._router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
            const id: string = req.params.id;
            const track: Track = req.body["track"];
            this.putTrack(id, track).then((result: UpdateWriteOpResult) => res.send(result))
                                    .catch((e: Error) => this.errorhandler(e));
        });

        this._router.put("/play/:id", (req: Request, res: Response, next: NextFunction) => {
            const id: string = req.params.id;
            this.incrementPlayTrack(id).then((result: UpdateWriteOpResult) => res.send(result))
                                       .catch((e: Error) => this.errorhandler(e));
        });

        this._router.put("/highscore/:id", (req: Request, res: Response, next: NextFunction) => {
            const id: string = req.params.id;
            const highScore: Highscore = req.body["highscore"];
            this.updateHighScore(id, highScore).then((result: UpdateWriteOpResult) => res.send(result))
                                               .catch((e: Error) => this.errorhandler(e));
        });
    }

    private postReq(): void {
        this._router.post("/", (req: Request, res: Response, next: NextFunction) => {
            const track: Track = req.body["track"];
            this.postTrack(track).then((result: InsertOneWriteOpResult) => res.send(result))
                                 .catch((e: Error) => this.errorhandler(e));
        });
    }

    private deleteReq(): void {
        this._router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
            const id: string = req.params.id;
            this.deleteTrack(id).then((result: DeleteWriteOpResultObject) => res.send(result))
                                .catch((e: Error) => this.errorhandler(e));
        });
    }

    private async postTrack(track: Track): Promise<InsertOneWriteOpResult> {
        this.connect();
        track._id = undefined;

        return this._collection.insertOne(track);
    }

    private async putTrack(id: string, track: Track): Promise<UpdateWriteOpResult> {
        this.connect();
        delete track._id; // Because mongo db don't accept _id as a string

        return this._collection.updateOne({_id: new ObjectId(id)},
                                          {$set: {points: track.points, name: track.name, description: track.description}});
    }

    private async getAllTracks(): Promise<Track[]> {
        this.connect();

        return this._collection.find({}).toArray();
    }

    private async deleteTrack(id: string): Promise<DeleteWriteOpResultObject> {
        this.connect();

        return this._collection.deleteOne({ _id: new ObjectId(id) });
    }

    private async getTrack(id: string): Promise<Track> {
        this.connect();

        return this._collection.findOne({ _id: new ObjectId(id) });
    }

    private async incrementPlayTrack(id: string): Promise<UpdateWriteOpResult> {
        this.connect();

        return this._collection.updateOne({ _id: new ObjectId(id) }, { $inc: { nbPlayed: 1 } });
    }

    private async updateHighScore(id: string, highScore: Highscore): Promise<UpdateWriteOpResult> {
        this.connect();

        const track: Track = await this.getTrack(id);

        if (track != null && highScore != null) {
            if (track.highscores == null) {
                track.highscores = new Array<Highscore>();
            }
            track.highscores.push(highScore);
            track.highscores.sort((a: Highscore, b: Highscore) => a.time - b.time );
            if (track.highscores.length > MAX_NUMBER_OF_HIGHSCORES ) {
                track.highscores.pop();
            }
        }

        return this._collection.updateOne({_id : new ObjectId(id)}, { $set : { highscores : track.highscores }});
    }

    private errorhandler(e: Error): void {
        console.error(e.message);
    }
}
