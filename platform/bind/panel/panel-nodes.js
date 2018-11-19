const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const files = require('./util/file-io');
const authorize = require('./util/authorize');


platform.core.node({
  path : `${config.path}nodes`,
  method : 'GET',
  public: config.expose,
  interconnectible: false,
  inputs: ['connect_token'],
  outputs : ['nodes'],
  controlOutputs: [platform.conventions.controls._Unauthorized],
},
(inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let pathmapfile = path.join(config.directory, config.files.pathmap);
      files.json.load(pathmapfile, {}).then(pathmap => {
        output('nodes', pathmap, true);
      });
    })
    .catch(() => control(platform.conventions.controls._Unauthorized));
});
