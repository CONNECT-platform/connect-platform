const path = require('path');
const platform = require('../../../');
const config = platform.config.get('panel', {});

let directory = null;
let vault = null;
let vaultdir = 'secure/';

if (platform.config.has('root')) {
  directory = path.join(platform.config.get('root'), config.directory || 'panel-generated/');
  vault = path.join(platform.config.get('root'), vaultdir);
}

module.exports = {
  expose: config.expose || false,
  secret: config.secret,
  path: config.path || '/panel/',
  directory: directory,
  files : {
    pathmap: 'path-map',
    index : 'index.js',
    nodedir : 'nodes',
    conf : 'config',
    platformconf: 'platform-config',
    platformprodconf: 'platform-config.prod',
    platformconfscript: 'platform-config.script.js',
    vaultlisting: 'vault-listing',
  },
  vault: vault,
  vaultdir: vaultdir,
}
