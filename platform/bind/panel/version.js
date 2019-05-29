const package = require('../../../package.json');

const platform = require('../../');
const config = require('./util/config');


platform.core.node({
  path : `${config.path}version`,
  method : 'GET',
  public: config.expose,
  outputs : ['version'],
  interconnectible: false,
},
(_, output) => {
  output('version', package.version);
});
