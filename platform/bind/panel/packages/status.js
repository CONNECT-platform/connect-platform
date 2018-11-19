const platform = require('../../../');
//const external = require('../../../loaders/load-external');
const config = require('../util/config');


platform.core.node({
  path : `${config.path}packages/status`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  inputs : ['name'],
  outputs : ['status']
}, (inputs, output, control) => {
  try {
    let mod = require(inputs.name);

    let provided = [];
    if (inputs.name in global.connect_platform_dependencies) provided = global.connect_platform_dependencies[inputs.name];

    let hints = [];
    if (mod.platform && mod.platform.hints) hints = mod.platform.hints;

    output('status', {
      installed: true,
      provided: provided,
      hints: hints,
    });
  } catch(_) {
    output('status', {
      installed: false,
    });
  }
});
