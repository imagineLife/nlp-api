// import { jest } from '@jest/globals';
import { runAnalytics } from './runAnalytics.js';
import setupTestDB from '../config/setupTestDb.js';
import { registerDbCollections } from '../../setup/db.js';
import { insertObj } from './../../mocks/speech.js';
import { speeches, stateObj } from './../../state.js';

describe('runAnalytics function', () => {
  // let app, dbClient;
  let dbClient, testSpeechId, foundData;

  beforeAll(async () => {
    // app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);
    
    let { insertedId } = await speeches().insertOne({ ...insertObj });    
    testSpeechId = insertedId;
  });

  afterAll(async () => {
    console.log('closing app');
    // await app.close();
    // await dbClient.dropDatabase();
    await dbClient.close();
  });

  it('returns true', async () => {
    const res = await runAnalytics(testSpeechId);
    expect(res).toBe(true);
  });

  it('finds inserted speech and validates keys are present on object', async () => {
    foundData = await speeches().findOne({ _id: testSpeechId });
    const expectedKeys = ['_id', 'author', 'text', 'date', 'analytics', 'updatedDate'];
    expectedKeys.forEach((k) => {
      expect(Object.keys(foundData).includes(k)).toBe(true);
    });
  })
});
