const platform = require('../../');
const db = require('./database');


platform.core.node({
  path: '/mongo-db/insert',
  public: false,
  inputs: ['collection', 'data'],
  outputs: ['id'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (db.connected) {
    try {
      db.instance
        .collection(inputs.collection)
        .insertOne(inputs.data)
        .then(({ insertedId }) => output('id', insertedId));
    } catch (error) {
      control('bad_input');
    }
  }
  else control('no_connection');
});
