import { jest } from '@jest/globals';
import supertest from 'supertest';
import { expressSetup, registerDbCollections } from './../../../../../setup/index.js';
import setupTestDB from './../../../../../lib/config/setupTestDb.js';

const SENTIMENT_EXCEL_URL = '/api/nlp/sentiment/excel';
describe(`POST ${SENTIMENT_EXCEL_URL}`, () => {
  let app, dbClient;
  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);
  });

  afterEach(() => {
    jest.resetModules();
  });

  afterAll(async () => {
    console.log('closing app');
    await app.close();
    await dbClient.dropDatabase();
    await dbClient.close();
  });

  let input = [[{ What: 'is this', When: 'was that' }]];

  it('works', async () => {
    const { statusCode, body, headers, text } = await supertest(app).post(SENTIMENT_EXCEL_URL).send({ text: input });
    expect(statusCode).toBe(200);
    expect(body instanceof Array).toBe(true);
    expect(body.length).toBe(Object.keys(input[0][0]).length);
  });
});
