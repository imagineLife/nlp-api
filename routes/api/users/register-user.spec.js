import supertest from 'supertest';
import { expressSetup } from './../../../setup/index.js';
import { registerDbCollections } from './../../../setup/db.js';
import setupTestDb from './../../../lib/config/setupTestDb.js';

describe('/api/users/register', () => {
  const REGISTER_URL = '/api/users/register';
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
  it('fails: 422 missing params', async () => {
    const { statusCode, body } = await supertest(app).post(REGISTER_URL);
    expect(statusCode).toBe(422);
    expect(body.Error).toBe('not allowed');
  });

  it('fails: multi-step process: email then ANOTHER email + pw', async () => {
    const firstEmail = 'first@email.com';
    const secondEmail = 'second@email.com';
    const pw = 'testPw';
    const { statusCode } = await supertest(app).post(REGISTER_URL).send({ email: firstEmail });
    expect(statusCode).toBe(200);

    const { statusCode: doneStatus, body } = await supertest(app)
      .post(REGISTER_URL)
      .send({ email: secondEmail, password: pw });
    expect(doneStatus).toBe(500);
    expect(body.Error).toBe('Cannot complete registration');
  });

  it('succeeds with email', async () => {
    const { statusCode } = await supertest(app)
      .post(REGISTER_URL)
      .send({ email: 'test@email.com' });
    expect(statusCode).toBe(200);
  });

  it('multi-step process: email then email + pw', async () => {
    const email = 'almostDone@email.com';
    const pw = 'testPw';
    const { statusCode } = await supertest(app).post(REGISTER_URL).send({ email });
    expect(statusCode).toBe(200);

    const { statusCode: doneStatus } = await supertest(app)
      .post(REGISTER_URL)
      .send({ email, password: pw });
    expect(doneStatus).toBe(200);
  });
});
