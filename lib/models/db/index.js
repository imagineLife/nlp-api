import { MongoClient } from 'mongodb';
import { stateObj } from './../../../state.js';
import { makeConnectionString } from '../../database/index.js';
import { logger } from '../../logger.js';
class DB {
  constructor({ connectionObj }) {
    this.connectionObj = connectionObj;
    this.client = null;
    this.db = null;
  }

  /*
    takes db connection obj
      username
      pw
      host
      port
      authDB
    returns the client

    TODO: if multiple db connections get introduced,
      update stateObj.MONGO_CLIENT to be more accommodating
  */
  async connect() {
    try {
      // Connect
      const uriStr = makeConnectionString(this.connectionObj);
      this.client = new MongoClient(uriStr);
      await this.client.connect();

      // store
      stateObj.MONGO_CONNECTED = true;
      stateObj.MONGO_CLIENT = this.client;
      logger.info(
        `DB: connected to mongo on ${this.connectionObj.host}:${this.connectionObj.port}`
      );

      return this.client;
    } catch (e) {
      logger.error(`DB Class connect method error:`);
      logger.error(e);
      throw new Error(e);
    }
  }

  async close() {
    await this.client.close();
    logger.info(`CLOSED db connection on ${this.connectionObj.host}:${this.connectionObj.port}`);
  }

  // Create a new Db instance sharing the current socket connections
  // assigns the db to "this.db"
  // returns the db object for use with working with collections in the db in the Crud model
  // DOCS: https://mongodb.github.io/node-mongodb-native/4.4/classes/MongoClient.html#db
  registerDB(dbName) {
    /*
      error-handling
    */
    if (!this.client) {
      throw new Error(
        'attempted to registerDB without building a client: use setupDB or "new DB()" to connect to a mongo instance'
      );
    }
    if (!dbName) {
      throw new Error('missing db name string param');
    }

    this.db = this.client.db(dbName);
    return this.db;
  }

  async getAndLogDBs() {
    const databasesList = await this.client.db().admin().listDatabases();
    const { databases } = databasesList;
    console.table(databases);
    return databases;
  }

  async dropDatabase() {
    await this.db.dropDatabase();
    return true;
  }
}

export { DB };
