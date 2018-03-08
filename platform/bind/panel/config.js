const platform = require('../../');
const config = platform.config.get('panel', {});


module.exports = {
  expose: config.expose || false,
  path: config.path || 'panel/',
}
