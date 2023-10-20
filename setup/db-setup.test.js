import { jest } from "@jest/globals";
import setupDB, { setupTestDB, registerDbCollections } from "./db.js";
import { DB } from "./../lib/models/db/index.js";
import { UserAuth } from "../lib/models/userAuth/index.js";
import { Crud } from "../lib/models/crud/index.js";
import { get } from "../state.js";
describe("setupTestDB", () => {
  const COLL_NAME = "TestUsers";
  const DB_NAME = "TestNlpDb";
  const dbObj = {
    host: "localhost",
    port: "27017",
  };
  let testedDb, connectSpy;
  beforeAll(async () => {
    process.env.MONGO_AUTH = false;
    connectSpy = jest.spyOn(DB.prototype, "connect");
  });
  afterEach(async () => {
    await testedDb.close();
  });
  it("setupTestDB: calls DB.connect method", async () => {
    testedDb = await setupTestDB({ ...dbObj });
    expect(connectSpy).toHaveBeenCalledTimes(1);
  });
  it("setupDB: calls DB.connect method", async () => {
    testedDb = await setupDB({ ...dbObj });
    expect(connectSpy).toHaveBeenCalledTimes(2);
  });
  it("registerDbCollections: sets state collections", async () => {
    testedDb = await setupTestDB({ ...dbObj });
    registerDbCollections(testedDb, true);
    let userCollection = get("Users");
    expect(userCollection instanceof UserAuth).toBe(true);
  });
});
