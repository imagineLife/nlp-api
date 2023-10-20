import { jest } from "@jest/globals";
import supertest from "supertest";
import { expressSetup } from "./../../../../setup/index.js";
import { registerDbCollections } from "./../../../../setup/db.js";
import setupTestDB from "./../../../../lib/config/setupTestDb.js";

const mockSpeechesFn = jest.fn();

describe("speeches byId", () => {
  const SPEECHES_URL = "/api/speeches";
  let app, dbClient, insertedSpeechId;
  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);

    // hmm
    const mockRunAnaytics = jest.fn();
    jest.unstable_mockModule("./../../../../lib/index.js", async () => ({
      runAnalytics: mockRunAnaytics,
    }));

    const {
      statusCode,
      headers: { location },
    } = await supertest(app).post(SPEECHES_URL).send({
      text: "This is a test speech. This is the second sentence of the test speech.",
      author: "test author",
      date: "01-01-2023",
    });

    insertedSpeechId = location.split("/")[2];
  });

  afterEach(() => {
    jest.resetModules();
  });

  afterAll(async () => {
    console.log("closing app");
    await app.close();
    await dbClient.dropDatabase();
    await dbClient.close();
  });

  it("GET success: returns a 200", async () => {
    const { body, status } = await supertest(app).get(
      `${SPEECHES_URL}/${insertedSpeechId}`,
    );

    expect(status).toBe(200);
    const expectedKeys = [
      "_id",
      "author",
      "text",
      "date",
      "analytics",
      "creationDate",
    ];
    expectedKeys.forEach((k) => {
      expect(Object.keys(body).includes(k)).toBe(true);
    });
  });

  it("GET fail: returns a 500 when module throws", async () => {
    // const stateModule = await import('./../../../state.js');

    jest.unstable_mockModule("./../../../../state.js", () => ({
      speeches: () => ({
        findOne: mockSpeechesFn.mockRejectedValueOnce({
          message: "mock thrown",
        }),
      }),
    }));

    const { statusCode, body } = await supertest(app)
      .get(`${SPEECHES_URL}/${insertedSpeechId}`)
      .send({
        text: "this is a test",
        author: "test author",
        date: "01-01-2023",
      });
    expect(statusCode).toBe(500);
    expect(body).toEqual({ Good: "Lord" });
  });
});
