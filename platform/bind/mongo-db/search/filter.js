const platform = require('../../../');
const db = require('../database');


platform.core.node({
  path: '/mongo-db/search/filter',
  public: false,
  inputs: ['query', 'field', 'op', 'value'],
  outputs: ['filtered'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (db.connected) {
    let {op, value, field} = inputs;
    let condition = {};
    condition[op] = value;
    let query = {};
    query[field] = condition; 
    output('filtered', inputs.query.filter(query));
  }
  else control('no_connection');
});
