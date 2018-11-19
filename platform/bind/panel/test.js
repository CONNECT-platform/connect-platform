const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const record = require('../../recorder');

const purify = require('./util/purify-recording');


platform.core.node({
  path : `${config.path}test`,
  public : config.expose,
  method : 'POST',
  interconnectible: false,
  inputs : ['model', 'inputs', 'timelimit'],
  outputs : ['recording', 'error'],
  controlOutputs : ['wrong_input'],
}, (inputs, output, control, _, context) => {

  let provided = Object.keys(inputs.inputs);
  if (inputs.model.in.some(input => !provided.includes(input))) {
    control('wrong_input');
    return;
  }

  record(inputs.model, inputs.inputs, platform.config.core, inputs.timelimit, context)
    .then(recording => {
      output('recording', purify(recording));
    })
    .catch(error => {
      console.log(error);
      output('error', error);
    });
});
