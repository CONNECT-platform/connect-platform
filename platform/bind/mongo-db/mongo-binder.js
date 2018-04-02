const platform = require('../../');
const mongoClient = require('mongodb').MongoClient;

let db;
let dbConnectErr;

let _config = platform.config.get('mongo-db');

mongoClient.connect(_config.dbURL, (err, client) => {
  if (!err) {
    db = client.db(_config.dbName);
  } else {
    dbConnectErr = err;
  }
});

platform.core.node({
  path: '/mongo-db/find',
  method: 'POST',
  public: true,
  inputs: ['collection', 'criteria'],
  // TODO: remove err
  outputs: ['result', 'err'],
  controlOutputs: ['db_not_available']
}, (inputs, output, control) => {
  if (db) {
    let { collection, criteria } = inputs;
    db.collection(collection).find(criteria || {}).toArray()
      .then(result => output('result', result))
      .catch(err => output('err', err))
  } else {
    control('db_not_available')
  }
});

platform.core.node({
  path: '/mongo-db/insert',
  method: 'POST',
  public: true,
  inputs: ['collection', 'documents'],
  outputs: ['result', 'err'],
  controlOutputs: ['db_not_available']
}, (inputs, output, control) => {
  if (db) {
    let { documents, collection } = inputs;
    db.collection(collection).insertMany(documents)
      .then(result => output('result', result.insertedIds))
      .catch(err => output('err', err))
  } else {
    control('db_not_available')
  }
});

platform.core.node({
  path: '/mongo-db/update',
  method: 'POST',
  public: true,
  inputs: ['args'],
  outputs: ['result', 'err'],
  controlOutputs: ['db_not_available']
}, (inputs, output, control) => {
  if (db) {
    let { collection, criteria, update } = inputs;
    db.collection(collection).updateMany(criteria, { $set: update })
      .then(result => output('result', result))
      .catch(err => output('err', err))
  } else {
    control('db_not_available')
  }
});

platform.core.node({
  path: '/mongo-db/delete',
  method: 'POST',
  public: true,
  inputs: ['args'],
  outputs: ['result', 'err'],
  controlOutputs: ['db_not_available']
}, (inputs, output, control) => {
  if (db) {
    let { collection, criteria } = inputs;
    db.collection(collection).deleteMany(criteria)
      .then(result => output('result', result))
      .catch(err => outpu('err', err))
  } else {
    control('db_not_available')
  }
});