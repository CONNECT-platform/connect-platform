const platform = require('../../');
const instance = require('./instance');


platform.core.node({
  path: '/firestore/get',
  public: false,
  inputs: ['collection', 'id'],
  outputs: ['data'],
  controlOutputs: ['not_found', 'no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    instance
      .collection(inputs.collection)
      .doc(inputs.id)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          output('data', snapshot.data());
        }
        else {
          control('not_found');
        }
      });
  }
  else control('no_connection');
});
