const path = require('path');

const platform = require('../../../');
const config = require('../util/config');
const files = require('../util/file-io');
const authorize = require('../util/authorize');


platform.core.node({
  path : `${config.path}config/save`,
  public : config.expose,
  method : 'PUT',
  interconnectible: false,
  inputs : ['connect_token', 'config'],
  controlOutputs: [ 'done',
    platform.conventions.controls._InternalError,
    platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let conffile = path.join(config.directory, config.files.platformconf);
      files.json.save(conffile, inputs.config).then(() => {
        control('done');
      }).catch(error => {
        control(platform.conventions.controls._InternalError);
      });
    })
    .catch(error => {
      control(platform.conventions.controls._Unauthorized);
    });
});

platform.core.node({
  path : `${config.path}config/prod/save`,
  public : config.expose,
  method : 'PUT',
  interconnectible: false,
  inputs : ['connect_token', 'config'],
  controlOutputs: [ 'done',
    platform.conventions.controls._InternalError,
    platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let conffile = path.join(config.directory, config.files.platformprodconf);
      files.json.save(conffile, inputs.config).then(() => {
        control('done');
      }).catch(error => {
        control(platform.conventions.controls._InternalError);
      });
    })
    .catch(error => {
      control(platform.conventions.controls._Unauthorized);
    });
});

platform.core.node({
  path : `${config.path}config/script/save`,
  public : config.expose,
  method : 'PUT',
  interconnectible: false,
  inputs : ['connect_token', 'script'],
  controlOutputs: [ 'done',
    platform.conventions.controls._InternalError,
    platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let conffile = path.join(config.directory, config.files.platformconfscript);
      files.save(conffile, inputs.script).then(() => {
        control('done');
      }).catch(error => {
        control(platform.conventions.controls._InternalError);
      });
    })
    .catch(error => {
      control(platform.conventions.controls._Unauthorized);
    });
});
