const platform = require('../../../');
const external = require('../../../loaders/load-external');
const config = require('../util/config');


platform.core.node({
  path : `${config.path}packages/status`,
  public : config.expose,
  method : 'GET',
  inputs : ['name'],
  outputs : ['status']
}, (inputs, output, control) => {
  try {
    require(inputs.name);

    let signatures = [];
    if (inputs.name in external.dependencies) signatures = external.dependencies[inputs.name];

    output('status', {
      installed: true,
      signatures: signatures,
    });
  } catch(_) {
    output('status', {
      installed: false,
    });
  }
});
