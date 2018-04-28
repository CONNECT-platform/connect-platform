const platform = require('../../');
let db = require('./database');
const { ObjectID } = require('mongodb');


platform.core.node({
  path: '/mongo-db/get',
  public: true,
  inputs: ['collection', 'id'],
  outputs: ['data'],
  controlOutputs: ['not_found', 'no_connection'],
}, (inputs, output, control) => {
  if (db.connected) {
    db.instance
      .collection(inputs.collection)
      .findOne({ _id: ObjectID(inputs.id) })
      .then(doc => {
        if (doc === null) {
          control('not_found');
        } else {
          output('data', doc);
        }
      })
      .catch(err => control('no_connection'))
    //             .catch();

  } else {
    control('no_connection');
  }
});
