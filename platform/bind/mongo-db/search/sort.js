const platform = require('../../../');
const db = require('../database');


platform.core.node({
  path: '/mongo-db/search/sort',
  public: false,
  inputs: ['query', 'field', 'direction'],
  outputs: ['sorted'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (db.connected) {
    let direction = 1;
    if (inputs.direction == 'descending') direction = -1;
    let sortOptions = {};
    sortOptions[inputs.field] = direction;
    output('sorted', inputs.query.sort(sortOptions));
  }
  else control('no_connection');
});
