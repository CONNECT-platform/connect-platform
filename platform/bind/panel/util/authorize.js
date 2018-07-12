const jwt = require('jsonwebtoken');

const config = require('./config');


module.exports = token => new Promise((resolve, reject) => {
  if (config.secret)
    jwt.verify(token, config.secret, {}, (error, payload) => {
      if (error) reject();
      else if (payload.connect_panel_access) resolve();
      else reject();
    });
  else resolve();
});
