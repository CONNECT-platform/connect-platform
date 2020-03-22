const platform = require('../../../');
const config = require('../util/config');


platform.core.node({
  path : `${config.path}services/remove`,
  public : config.expose,
  method : 'POST',
  interconnectible: false,
  inputs : ['name', 'connect_token'],
  outputs : [],
  controlOutputs: [ 'done', platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  platform.call(`${config.path}config/load`,
    { connect_token: inputs.connect_token })
    .then(result => {
      if (result.data) {
        let conf = result.data;

        if (conf.nodes && conf.nodes.service) {
          conf.nodes.service = conf.nodes.service.filter(service => service.name != inputs.name);

          platform.call(`${config.path}config/save`, {
            connect_token: inputs.connect_token,
            config: conf,
          })
          .then(() => control('done'));
        }
        else control('done');
      }
      else control(platform.conventions.controls._Unauthorized);
    });
});
