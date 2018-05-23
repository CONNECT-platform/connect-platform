const path = require('path');

const platform = require('../../');
const config = require('./config');
const record = require('../../recorder');


platform.core.node({
  path : `${config.path}test`,
  public : config.expose,
  method : 'POST',
  inputs : ['model', 'inputs'],
  outputs : ['recording', 'error'],
  controlOutputs : ['wrong_input'],
}, (inputs, output, control) => {

  let provided = Object.keys(inputs.inputs);
  if (inputs.model.in.some(input => !provided.includes(input))) {
    control('wrong_input');
    return;
  }

  record(inputs.model, inputs.inputs, platform.config.core)
    .then(recording => {
      let cache = [];
      let purified = JSON.stringify(recording, (key, value) => {
        if (key == 'subject') return;
        if (typeof value === 'object' && value != null) {
          if (cache.includes(value)) return "_referenced earlier_";
          else cache.push(value);
        }

        return value;
      });

      output('recording', JSON.parse(purified));
    })
    .catch(error => {
      output('error', error);
    });
});
