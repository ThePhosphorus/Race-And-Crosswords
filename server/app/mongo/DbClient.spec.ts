import * as assert from "assert";
import { DbClient } from "./DbClient";
import { container } from "../inversify.config";
import Types from "../types";

// tslint:disable-next-line:max-func-body-length
describe("MongoDb Database", () => {
    const dbClient: DbClient = container.get<DbClient>(Types.DbClient);
    it("should Create", () => {
        assert(dbClient);
    });

    it ("should create DB", () => {
        assert(dbClient.db);
    });
});
