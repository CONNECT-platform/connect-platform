const express = require('express');
const path = require('path');

const platform = require('../../');
const config = require('./config');


platform.subscribe(platform.events.bind, (_, platform) => {
  if (config.expose) {
    let staticFiles = path.join(__dirname, '../../../panel/dist/');
    platform.app.use(config.path, express.static(staticFiles));
  }
});

module.exports.platform = {
  config : {
    nodes: {
      native: [
        "registry-service",
        "save-node",
      ],
    },
  },
}
