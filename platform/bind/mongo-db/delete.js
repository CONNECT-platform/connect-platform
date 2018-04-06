const platform = require('../../');
const instance = require('./instance');


platform.core.node({
  path: '/firestore/delete',
  public: false,
  inputs: ['collection', 'id'],
  outputs: [],
  controlOutputs: ['done', 'no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    instance
      .collection(inputs.collection)
      .doc(inputs.id)
      .delete()
      .then(() => {
          control('done');
      });
  }
  else control('no_connection');
});
