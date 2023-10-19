// import { jest } from '@jest/globals';
import { runAnalytics } from './runAnalytics.js';
import setupTestDB from '../config/setupTestDb.js';
import { registerDbCollections } from '../../setup/db.js';
import { insertObj } from './../../mocks/speech.js';
import { get } from './../../state.js';

describe('runAnalytics function', () => {
  // let app, dbClient;
  let dbClient, testSpeechId, foundData;

  beforeAll(async () => {
    // app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);
    
    let { insertedId } = await get('Speeches').insertOne({ ...insertObj });    
    testSpeechId = insertedId;
  });

  afterAll(async () => {
    console.log('closing app');
    await dbClient.close();
  });

  it('returns true', async () => {
    const res = await runAnalytics(testSpeechId);
    expect(res).toBe(true);
  });
});
