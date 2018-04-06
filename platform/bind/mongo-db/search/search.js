const platform = require('../../../');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search',
  public: false,
  inputs: ['collection'],
  outputs: ['query'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    output('query', instance.collection(inputs.collection));
  }
  else control('no_connection');
});
