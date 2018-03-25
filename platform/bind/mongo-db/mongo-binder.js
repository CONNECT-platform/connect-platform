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
  path: '/mongo-db',
  method: 'POST',
  public: true,
  inputs: ['args'],
  outputs: ['result', 'err'],
}, (inputs, output, control) => {
  if (db) {
    let { method, collection } = inputs.args;
    if (method === 'find') {
      let { criteria } = inputs.args;
      db.collection(collection).find(criteria || {}).toArray()
        .then(result => output('result', result))
        .catch(err => output('err', err))
    } else if (method === 'insert') {
      let { documents } = inputs.args;
      db.collection(collection).insertMany(documents)
        .then(result => output('result', result.insertedIds))
        .catch(err => output('err', err))
    } else if (method === 'update') {
      let { criteria, update } = inputs.args;
      db.collection(collection).updateMany(criteria, { $set: update })
        .then(result => output('result', result))
        .catch(err => output('err', err))
    } else if (method === 'delete') {
      let { criteria } = inputs.args;
      db.collection(collection).deleteMany(criteria)
        .then(result => output('result', result))
        .catch(err => outpu('err', err))
    } else {
      output('err', `method ${method} is not supported`);
    }
  } else {
    output('err', `connection to db is not available with error ${dbConnectErr}`)
  }
});