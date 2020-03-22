const platform = require('../../../');
const config = require('../util/config');


platform.core.node({
  path : `${config.path}services/save`,
  public : config.expose,
  method : 'POST',
  interconnectible: false,
  inputs : ['name', 'url', 'connect_token'],
  outputs : [],
  controlOutputs: [ 'done', platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  platform.call(`${config.path}config/load`,
    { connect_token: inputs.connect_token })
    .then(result => {
      if (result.data) {
        let conf = result.data;

        conf.nodes = conf.nodes || {};
        conf.nodes.service = conf.nodes.service || [];

        if (conf.nodes.service.some(service => service.name == inputs.name))
          conf.nodes.service.forEach(service => {
            if (service.name == inputs.name)
              service.url = inputs.url;
          });
        else conf.nodes.service.push({name: inputs.name, url: inputs.url});

        platform.call(`${config.path}config/save`, {
          connect_token: inputs.connect_token,
          config: conf,
        })
        .then(() => control('done'));
      }
      else control(platform.conventions.controls._Unauthorized);
    });
});
