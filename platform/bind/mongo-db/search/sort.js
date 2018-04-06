const platform = require('../../../');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/sort',
  public: false,
  inputs: ['query', 'field', 'direction'],
  outputs: ['sorted'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    let direction = 'asc';
    if (inputs.direction == 'descending') direction = 'desc';
    output('sorted', inputs.query.orderBy(inputs.field, direction));
  }
  else control('no_connection');
});
