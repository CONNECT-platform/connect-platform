const path = require('path');

const platform = require('../../../');
const config = require('../util/config');
const files = require('../util/file-io');


platform.core.node({
  path : `${config.path}vault/delete/:key`,
  public : config.expose,
  method : 'DELETE',
  interconnectible: false,
  inputs : ['key', 'connect_token'],
  controlOutputs: [ 'done',
    platform.conventions.controls._NotFound,
    platform.conventions.controls._Unauthorized ],
}, (inputs, output, control, error) => {
  platform.call(`${config.path}vault/list`,
    {
      connect_token: inputs.connect_token,
    },
    result => {
      if (result.data) {
        let list = result.data;
        let listingfile = path.join(config.directory, config.files.vaultlisting);

        if (list.keys.includes(inputs.key)) {
          list.keys = list.keys.filter(key => key != inputs.key)
          files.json.save(listingfile, list);

          let keyfile = path.join(config.vault, inputs.key);
          files.delete(keyfile).catch(() => {});

          control('done');
        }
        else control(platform.conventions.controls._NotFound);
      }
      else control(platform.conventions.controls._Unauthorized);
    }
  );
});
