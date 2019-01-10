const path = require('path');

const platform = require('../../../');
const config = require('../util/config');
const files = require('../util/file-io');
const authorize = require('../util/authorize');


platform.core.node({
  path : `${config.path}config/load`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  inputs : ['connect_token'],
  outputs : ['config'],
  controlOutputs: [ platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let conffile = path.join(config.directory, config.files.platformconf);
      files.json.load(conffile).then(conf => {
        output('config', conf);
      }).catch(error => {
        output('config', {});
      });
    })
    .catch(error => {
      control(platform.conventions.controls._Unauthorized);
    });
});

platform.core.node({
  path : `${config.path}config/prod/load`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  inputs : ['connect_token'],
  outputs : ['config'],
  controlOutputs: [ platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let conffile = path.join(config.directory, config.files.platformprodconf);
      files.json.load(conffile).then(conf => {
        output('config', conf);
      }).catch(error => {
        output('config', {});
      });
    })
    .catch(error => {
      control(platform.conventions.controls._Unauthorized);
    });
});

platform.core.node({
  path : `${config.path}config/script/load`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  inputs : ['connect_token'],
  outputs : ['script'],
  controlOutputs: [ platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let conffile = path.join(config.directory, config.files.platformconfscript);
      files.load(conffile).then(script => {
        output('script', script);
      }).catch(error => {
        output('script', '');
      });
    })
    .catch(error => {
      control(platform.conventions.controls._Unauthorized);
    });
});
