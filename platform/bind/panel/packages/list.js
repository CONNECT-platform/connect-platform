const platform = require('../../../');
const config = require('../util/config');


platform.core.node({
  path : `${config.path}packages/list`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  inputs : ['connect_token'],
  outputs : ['list'],
  controlOutputs: [ platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  platform.call(`${config.path}config/load`,
    { connect_token: inputs.connect_token })
    .then(result => {
      if (result.data) {
        if (result.data.nodes && result.data.nodes.module)
          output('list', result.data.nodes.module);
        else
          output('list', []);
      }
      else control(platform.conventions.controls._Unauthorized);
    });
});
