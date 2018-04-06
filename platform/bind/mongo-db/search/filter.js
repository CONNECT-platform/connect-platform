const platform = require('../../../');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/filter',
  public: false,
  inputs: ['query', 'field', 'op', 'value'],
  outputs: ['filtered'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    output('filtered', inputs.query.where(inputs.field, inputs.op, inputs.value));
  }
  else control('no_connection');
});
