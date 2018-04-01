const platform = require('../../../');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/resolve',
  public: false,
  inputs: ['query'],
  outputs: ['result', 'db_error'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    inputs.query.get().then(snapshot => {
      output('result', snapshot.docs.map(doc => doc.data()));
    }).catch(error => {
      output('db_error', error.details);
    });
  }
  else control('no_connection');
});
