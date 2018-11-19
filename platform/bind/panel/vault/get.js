const path = require('path');

const platform = require('../../../');
const config = require('../util/config');
const files = require('../util/file-io');


platform.core.node({
  path : `${config.path}vault/get`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  inputs : ['key', 'connect_token'],
  outputs: ['content'],
  controlOutputs: [
    platform.conventions.controls._NotFound,
    platform.conventions.controls._Unauthorized
  ],
}, (inputs, output, control, error) => {
  platform.call(`${config.path}vault/list`,
    {
      connect_token: inputs.connect_token,
    },
    result => {
      if (result.data) {
        let list = result.data;

        if (!list.keys.includes(inputs.key)) {
          control(platform.conventions._NotFound);
        }
        else {
          let keyfile = path.join(config.vault, inputs.key);
          files.load(keyfile).then(content => {
              output('content', content);
            })
            .catch(err => {
              error(err);
            });
        }
      }
      else control(platform.conventions.controls._Unauthorized);
    }
  );
});
