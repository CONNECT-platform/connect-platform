const path = require('path');
const platform = require('../../../');
const config = platform.config.get('panel', {});

let directory = null;

if (platform.config.has('root')) {
  directory = path.join(platform.config.get('root'), config.directory || 'panel-generated/');
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
  }
}
