const platform = require('../../');
const instance = require('./instance');


platform.core.node({
  path: '/firestore/update',
  public: false,
  inputs: ['collection', 'id', 'data'],
  outputs: [],
  controlOutputs: ['done', 'not_found', 'no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      instance
        .collection(inputs.collection)
        .doc(inputs.id)
        .update(Object.assign({}, inputs.data))
        .then(() => { control('done'); })
        .catch(error => { control('not_found'); });
    }
    catch(error) {
      control('bad_input');
    }
  }
  else control('no_connection');
});
