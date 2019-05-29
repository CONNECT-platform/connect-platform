module.exports = conf => {
  const platform = require('../../');

  let config = conf?conf.get('remote_shell', {}):platform.config.get('remote_shell', {});

  return {
    enabled: config.enabled || false,
    path: config.path || '/shell',
  }
}
