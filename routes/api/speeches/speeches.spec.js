import supertest from 'supertest';
import { expressSetup } from './../../../setup/index.js';
import { registerDbCollections } from './../../../setup/db.js';
import setupTestDB from './../../../lib/config/setupTestDb.js';
describe('speeches', () => {
  const GET_SPEECHES_URL = '/api/speeches';
  let app, dbClient;
  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
    registerDbCollections(dbClient);
  });
  afterAll(() => {
    console.log('closing app');
    app.close();
    dbClient.close()
  });

  it('GET', async () => {
    const { statusCode, body } = await supertest(app).get(GET_SPEECHES_URL);
    expect(statusCode).toBe(200);
    console.log('body')
    console.log(body)
  });
});
