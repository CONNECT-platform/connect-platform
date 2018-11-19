const platform = require('../../../');
const config = require('../util/config');


platform.core.node({
  path : `${config.path}packages/install`,
  public : config.expose,
  method : 'POST',
  interconnectible: false,
  inputs : ['connect_token', 'name', 'source'],
  controlOutputs: [
    'done',
    'already_installed',
    platform.conventions.controls._Unauthorized
  ],
}, (inputs, output, control) => {
  platform.call(`${config.path}config/load`,
    { connect_token: inputs.connect_token })
    .then(result => {
      if (result.data) {
        let conf = result.data;

        conf.nodes = conf.nodes || {};
        conf.nodes.module = conf.nodes.module || [];

        if (conf.nodes.module.some(pkg => {
            if (typeof pkg == 'object' && pkg.name) return pkg.name == inputs.name;
            else return pkg == inputs.name;
          }))
          control('already_installed');
        else {
          conf.nodes.module.push({
            name: inputs.name,
            source: inputs.source,
          });

          platform.call(`${config.path}config/save`, {
            connect_token: inputs.connect_token,
            config: conf,
          })
          .then(() => control('done'));
        }
      }
      else control(platform.conventions.controls._Unauthorized);
    });
});
