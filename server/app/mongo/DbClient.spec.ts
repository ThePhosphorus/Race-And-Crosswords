import * as assert from "assert";
import { DbClient } from "./DbClient";

// tslint:disable-next-line:max-func-body-length
describe("MongoDb Database", () => {
    const dbClient: DbClient = new DbClient();
    it("should Create", () => {
        assert(dbClient);
    });

    it ("should create DB", () => {
        assert(dbClient.db);
    });
});
