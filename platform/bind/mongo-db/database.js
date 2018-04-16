const { MongoClient } = require('mongodb');
const platform = require('../../');


class DBNotAvailable extends Error {
  constructor(message = 'connection to mongodb instance is not available') {
    super(message);
  }
}

let config = platform.config.get('mongo-db', {});
let instance = undefined;

if (config.URL && config.db) {
  MongoClient.connect(config.URL, (err, client) => {
    if (err) {
      console.log('mongo db connect error', err)
    } else {
      instance = client.db(config.db)
    }
  });
}

module.exports = {
  get connected() {
    return instance !== undefined;
  },
  get instance() {
    if (instance === undefined) {
      throw new DBNotAvailable();
    } else {
      return instance;
    }
  }
};
