const platform = require('../../../');
const db = require('../database');


platform.core.node({
  path: '/mongo-db/search/offset',
  public: false,
  inputs: ['query', 'offset'],
  outputs: ['offsetted'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (db.connected) {
    output('offsetted', inputs.query.skip(inputs.offset));
  }
  else control('no_connection');
});
