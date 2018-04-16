const platform = require('../../../');
const db = require('../database');


platform.core.node({
  path: '/mongo-db/search',
  public: false,
  inputs: ['collection'],
  outputs: ['query'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (db.connected) {
    output('query', db.instance.collection(inputs.collection).find());
  }
  else control('no_connection');
});
