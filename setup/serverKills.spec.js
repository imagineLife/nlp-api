import { jest } from "@jest/globals";
import { serverKiller } from "./serverKills.js";
import { expressSetup } from "./index.js";
import setupTestDB from "./../lib/config/setupTestDb.js";
describe("serverKills", () => {
  let app, dbClient;
  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
  });
  afterAll(async () => {
    console.log("closing app");
    await app.close();
    await dbClient.dropDatabase();
    await dbClient.close();
  });
  it("registers events on process keys?!", async () => {
    const logSpy = jest.spyOn(global.console, "log");
    serverKiller(app, dbClient);
    let registeredEvents = ["SIGINT", "SIGTERM", "SIGQUIT"];
    logSpy.mock.calls.forEach((call, callIdx) => {
      expect(call[0]).toEqual(
        `registering signal handling for ${registeredEvents[callIdx]}`,
      );
    });
  });
});
