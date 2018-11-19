const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const files = require('./util/file-io');
const authorize = require('./util/authorize');


platform.core.node({
  path : `${config.path}load/:id`,
  public : config.expose,
  interconnectible: false,
  method : 'GET',
  inputs : ['id', 'connect_token'],
  outputs : ['node'],
  controlOutputs: [
    platform.conventions.controls._Unauthorized,
    platform.conventions.controls._NotFound,
  ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let nodefile = path.join(config.directory, config.files.nodedir, inputs.id);
      files.json.load(nodefile).then(node => {
        output('node', node);
      }).catch(error => {
        control(platform.conventions.controls._NotFound);
      });
    })
    .catch(error => {
      control(platform.conventions.controls._Unauthorized);
    })
});
