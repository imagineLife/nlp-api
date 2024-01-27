import { config as dotenvConfig } from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { expressSetup, setupDB, registerDbCollections, serverKiller } from './setup/index.js';
import { buildThemes } from './lib/index.js';
import { logger } from './lib/logger.js';
async function setup() {
  logger.info('process.pid:', process.pid);

  // env
  dotenvConfig();
  logger.info('ENV: config done');

  // db
  const DbClient = await setupDB();
  registerDbCollections(DbClient);

  // themes...maybe remove + update to mongo-stored themes...
  buildThemes();

  // api
  let expressObj = expressSetup();
  serverKiller(expressObj, DbClient);
}

// setupLogger();
setup();
