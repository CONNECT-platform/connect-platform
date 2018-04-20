const platform = require('../../');
const db = require('./database');
let { ObjectId } = require('mongodb');


platform.core.node({
  path: '/mongo-db/update',
  public: false,
  inputs: ['collection', 'id', 'data'],
  outputs: [],
  controlOutputs: ['done', 'not_found', 'no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (db.connected) {
    try {
      db.instance
        .collection(inputs.collection)
        .findOneAndUpdate({ _id: ObjectId(inputs.id) }, { $set: inputs.data })
        .then(modification => {
          if (modification.ok) {
            if (modification.value === null) {
              control('not_found')
            } else {
              control('done')
            }
          } else {
            throw modification.lastErrorObject;
          }
        })
        // account for mongodb errors (probably database status)
        // TODO: please try to reconnect on such occations
        .catch(error => control('no_connection'));
    }
    catch (error) {
      control('bad_input');
    }
  }
  else control('no_connection');
});
