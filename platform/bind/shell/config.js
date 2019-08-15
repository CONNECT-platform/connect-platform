module.exports = conf => {
  const platform = require('../../');

  let config = conf?conf.get('remote-shell', {}):platform.config.get('remote-shell', {});

  return {
    enabled: config.enabled || false,
    path: config.path || '/shell',
  }
}
