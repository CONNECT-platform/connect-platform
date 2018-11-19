const path = require('path');

const platform = require('../../../');
const config = require('../util/config');
const files = require('../util/file-io');


platform.core.node({
  path : `${config.path}vault/put`,
  public : config.expose,
  method : 'PUT',
  interconnectible: false,
  inputs : ['key', 'content', 'connect_token'],
  controlOutputs: [ 'done', platform.conventions.controls._Unauthorized ],
}, (inputs, output, control, error) => {
  platform.call(`${config.path}vault/list`,
    {
      connect_token: inputs.connect_token,
    },
    result => {
      if (result.data) {
        let list = result.data;
        let listingfile = path.join(config.directory, config.files.vaultlisting);

        if (!list.keys.includes(inputs.key)) {
          list.keys.push(inputs.key);
          files.json.save(listingfile, list)
            .then(() => {})
            .catch(() => {});
        }

        let keyfile = path.join(config.vault, inputs.key);
        files.save(keyfile, inputs.content)
          .then(() => {
            control('done');
          })
          .catch(err => {
            error(err);
          });
      }
      else control(platform.conventions.controls._Unauthorized);
    }
  );
});
