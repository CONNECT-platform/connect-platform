const platform = require('../../');
const instance = require('./instance');


platform.core.node({
  path: '/firestore/insert',
  public: false,
  inputs: ['collection', 'data'],
  outputs: ['id'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      instance
        .collection(inputs.collection)
        .add(Object.assign({}, inputs.data))
        .then(doc => {
          output('id', doc.id);
        });
    } catch(error) {
      control('bad_input');
    }
  }
  else control('no_connection');
});
