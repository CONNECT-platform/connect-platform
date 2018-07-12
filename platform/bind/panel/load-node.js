const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const files = require('./util/file-io');


platform.core.node({
  path : `${config.path}load/:id`,
  public : config.expose,
  method : 'GET',
  inputs : ['id'],
  outputs : ['node'],
  controlOutputs : ['not_found']
}, (inputs, output, control) => {
  let nodefile = path.join(config.directory, config.files.nodedir, inputs.id);
  files.json.load(nodefile).then(node => {
    output('node', node, true);
  }).catch(error => {
    control('not_found', true);
  });
});
