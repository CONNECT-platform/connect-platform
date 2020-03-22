const process = require('child_process');

const ct = require('../../../util/color-text');
const platform = require('../../../');
const config = require('../util/config');



platform.core.node({
  path : `${config.path}packages/uninstall`,
  public : config.expose,
  method : 'POST',
  interconnectible: false,
  inputs : ['connect_token', 'name'],
  controlOutputs: [
    'done',
    'not_installed',
    platform.conventions.controls._Unauthorized
  ],
}, (inputs, output, control) => {
  platform.call(`${config.path}config/load`,
    { connect_token: inputs.connect_token })
    .then(result => {
      if (result.data) {
        let conf = result.data;
        let match = pkg => {
          if (typeof pkg == 'object' && pkg.name) return pkg.name == inputs.name;
          else return pkg == inputs.name;
        };

        if (!conf.nodes || !conf.nodes.module ||
            !conf.nodes.module.some(match))
          control('not_installed');
        else {
          console.log(ct(ct.blue + ct.bright, 'UNINSTALLING EXTERNAL PACKAGE::') + ct(ct.underscore, inputs.name));
          process.exec(`npm uninstall ${inputs.name}`, error => {
            if (error)
              console.log(ct(ct.red + ct.bright, `ERROR:: could not uninstall ${inputs.name}: `) + error);
            else {
              console.log(ct(ct.blue + ct.bright, 'EXTERNAL PACKAGE REMOVED::') + ct(ct.underscore, inputs.name));
              conf.nodes.module = conf.nodes.module.filter(pkg => !match(pkg));

              platform.call(`${config.path}config/save`, {
                connect_token: inputs.connect_token,
                config: conf,
              })
              .then(() => control('done'));
            }
          });
        }
      }
      else control(platform.conventions.controls._Unauthorized);
    });
});
