const platform = require('../../../');
const db = require('../database');


platform.core.node({
  path: '/mongo-db/search/limit',
  public: false,
  inputs: ['query', 'limit'],
  outputs: ['limited'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (db.connected) {
    output('limited', inputs.query.limit(inputs.limit));
  }
  else control('no_connection');
});
