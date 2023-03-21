import { expressSetup, setupDB } from './setup/index.js';
import { buildThemes } from './lib/index.js'

const dbObj = {
  username: process.env.MONGO_DB_USER,
  pw: process.env.MONGO_DB_PW,
  host: process.env.MONGO_DB_HOST,
  port: process.env.MONGO_DB_PORT,
  authDB: process.env.MONGO_DB_AUTH_DB,
};
const MongoClient = await setupDB({ ...dbObj });

setupDB()
buildThemes()
expressSetup();
