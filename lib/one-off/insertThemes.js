import { setupTestDB } from '../../setup/db.js';
import { mapArr } from '../themes.js';

async function insertThemes() {
  process.env.MONGO_AUTH = false;
  // vars
  const DB_NAME = 'Nlp';
  const COLLECTION_NAME = 'Themes';
  const DB_HOST = 'localhost';
  // prep insert array
  const arrToInsert = mapArr.map((themeObj) => ({
    _id: themeObj.name,
    words: themeObj.wordList,
    dateCreated: new Date(),
  }));

  // setup db + collection
  const processDB = await setupTestDB({ host: DB_HOST, port: 27017 });
  const NlpDb = processDB.registerDB(DB_NAME);
  let themesCollection = NlpDb.collection(COLLECTION_NAME);

  // do work - clear db + insert "from scratch"
  await themesCollection.drop();
  // let { insertedCount, insertedIds, acknowledged } = await themesCollection.insertMany(arrToInsert);
  let { insertedCount, insertedIds, acknowledged } = await themesCollection.insertMany(arrToInsert);

  console.log({
    collectionName: COLLECTION_NAME,
    insertedCount,
    insertedIds,
    acknowledged,
  });
  await processDB.close();
}

insertThemes();
