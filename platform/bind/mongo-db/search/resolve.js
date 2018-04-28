const platform = require('../../../');
const db = require('../database');


platform.core.node({
  path: '/mongo-db/search/resolve',
  public: false,
  inputs: ['query'],
  outputs: ['result', 'db_error'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (db.connected) {
    inputs.query.toArray()
      .then(docs => output('result', docs))
      .catch(error => {
        output('db_error', error.details);
      });
  }
  else control('no_connection');
});
