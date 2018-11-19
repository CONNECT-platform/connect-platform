const platform = require('../../../');
const config = require('../util/config');
const authorize = require('../util/authorize');


platform.core.node({
  path : `${config.path}services/info`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  inputs : ['name', 'connect_token'],
  outputs : ['info'],
  controlOutputs: [
      platform.conventions.controls._NotFound,
      platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      if (inputs.name in global.connect_platform_service_dependencies)
        output('info', global.connect_platform_service_dependencies[inputs.name]);
      else control(platform.conventions.controls._NotFound);
    })
    .catch(error => control(platform.conventions.controls._Unauthorized));
});
