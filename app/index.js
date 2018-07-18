const path = require('path');
const platform = require('platform');


platform
  .configure(require('./config'))
  .configure({root: __dirname});

try {
  let panelconf = require('./panel-generated/platform-config');
  platform.configure(panelconf);
} catch(err) {}

platform.start()
  .then(server => {
    console.log(`running on http://${server.address().address}` +
                `:${server.address().port}`);
  });
