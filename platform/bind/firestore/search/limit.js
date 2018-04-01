const platform = require('../../../');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/limit',
  public: false,
  inputs: ['query', 'limit'],
  outputs: ['limited'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    output('limited', inputs.query.limit(inputs.limit));
  }
  else control('no_connection');
});
