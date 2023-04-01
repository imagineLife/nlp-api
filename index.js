import { config as dotenvConfig } from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { expressSetup, setupDB } from './setup/index.js';
import { buildThemes } from './lib/index.js';
import { Crud } from './lib/models/crud/index.js'
import { stateObj } from './state.js';

async function setup() { 
  dotenvConfig();
  console.log('ENV: config done');
  const DbClient = await setupDB();
  const NlpDb = DbClient.registerDB("Nlp");
  const SpeechesCollection = new Crud({
    db: NlpDb,
    collection: 'Speeches'
  });
  stateObj.Collections.Speeches = SpeechesCollection;

  buildThemes();
  expressSetup();
} 

setup()
