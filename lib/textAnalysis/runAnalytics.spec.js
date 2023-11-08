import { runAnalytics } from './runAnalytics.js';
import setupTestDB from '../config/setupTestDb.js';
import { registerDbCollections } from '../../setup/db.js';
import { insertObj } from './../../mocks/speech.js';
import { get } from './../../state.js';
import { buildThemes } from '../themes.js';
describe('runAnalytics function', () => {
  // let app, dbClient;
  let dbClient, testSpeechId;

  beforeAll(async () => {
    // app = expressSetup();
    buildThemes();
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

  it('returns true from `runAnalytics` fn', async () => {
    const res = await runAnalytics(testSpeechId);
    expect(res).toBe(true);
  });
  it('asserts expected keys are in the anlytics object of the inserted speech', async () => {
    const foundSpeech = await await get('Speeches').findOne({ _id: testSpeechId });
    let analyticKeys = Object.keys(foundSpeech.analytics);
    console.log('analyticKeys');
    console.log(analyticKeys);

    let expectedAnalyticsKeys = [
      'avgWordsPerSentence',
      'lessStopwords',
      'longestThirty',
      'ngrams',
      'sentenceCount',
      'sentences',
      'sentiments',
      'themesCounts',
      'wordCount',
    ];
    expectedAnalyticsKeys.forEach((k) => {
      expect(analyticKeys.includes(k)).toBe(true);
    });
  });
});
