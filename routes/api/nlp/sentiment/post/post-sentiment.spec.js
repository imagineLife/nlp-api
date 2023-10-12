import { jest } from '@jest/globals';
import supertest from 'supertest';
import { expressSetup, registerDbCollections } from './../../../../../setup/index.js';
import setupTestDB from './../../../../../lib/config/setupTestDb.js';

const SENTIMENT_URL = '/api/nlp/sentiment';
describe(`POST ${SENTIMENT_URL}`, () => {

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

  let sentences =
    'This is the first sentence, and it will be extremely negative. The second sentence is here and it is fabulously amazing. Third sentence is neutral. And the fourth.';

  
  it('works', async () => {
    const { statusCode, body } = await supertest(app).post(SENTIMENT_URL).send({text: sentences});
    expect(statusCode).toBe(200);
    const expectedBodyKeys = ['summary', 'sentenceAnalysis'];
    expect(Object.keys(body)).toEqual(expectedBodyKeys)
    
    
  });
});
