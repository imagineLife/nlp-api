import supertest from 'supertest';
import { expressSetup } from './../../../setup/index.js';
import { registerDbCollections } from './../../../setup/db.js';
import setupTestDb from './../../../lib/config/setupTestDb.js';

describe('users', () => {
  const USERS_URL = '/api/users';
  let app, dbClient;
  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDb();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);
  });

  afterAll(async () => {
    console.log('closing app');
    await app.close();
    await dbClient.dropDatabase();
    await dbClient.close();
  });

  it('GET returns a 200', async () => {
    const { statusCode } = await supertest(app).get(USERS_URL);
    expect(statusCode).toBe(200);
  });

  it('GET /users/:email/auth returns 404 when not in session', async () => {
    const MOCK_EMAIL = 'test@user.com';
    const { statusCode } = await supertest(app).get(`${USERS_URL}/${MOCK_EMAIL}/auth`);
    expect(statusCode).toBe(404);
  });
});
