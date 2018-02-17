import { MongoClient, Db } from "mongodb";
import { injectable } from "inversify";

const DB_USER: string = "web";
const DB_PASSWORD: string = "webApi";
const DB_DB: string = "log2990-team21";
const DB_URL: string = "mongodb://" + DB_USER + ":" + DB_PASSWORD + "@ds239638.mlab.com:39638/" + DB_DB;

@injectable()
export class DbClient {
    public db: Db;

    public constructor() {
        this.connect();
    }

    public connect(): Promise<void> {
        return MongoClient.connect(DB_URL)
            .then((client: MongoClient) => {
                this.db = client.db(DB_DB);
            }).catch((err: Error) => {
                console.error(err);
            });
    }
}
