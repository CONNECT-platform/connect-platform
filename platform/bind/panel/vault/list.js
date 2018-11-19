const path = require('path');

const platform = require('../../../');
const config = require('../util/config');
const files = require('../util/file-io');
const authorize = require('../util/authorize');


platform.core.node({
  path : `${config.path}vault/list`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  inputs : ['connect_token'],
  outputs : ['list'],
  controlOutputs: [ platform.conventions.controls._Unauthorized ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      let listingfile = path.join(config.directory, config.files.vaultlisting);
      files.json.load(listingfile).then(listing => {
        output('list', listing);
      }).catch(error => {
        output('list', {
          keys: [],
          directory: config.vaultdir,
        });
      });
    })
    .catch(error => {
      control(platform.conventions.controls._Unauthorized);
    });
});
