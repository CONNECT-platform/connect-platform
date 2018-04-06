const platform = require('../../../');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/offset',
  public: false,
  inputs: ['query', 'offset'],
  outputs: ['offsetted'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    output('offsetted', inputs.query.offset(inputs.offset));
  }
  else control('no_connection');
});
