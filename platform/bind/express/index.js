const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router');
const init = require('./init');


module.exports = (app, config) => {
  if (!app) app = init();

  app.use(bodyParser.json());

  if (config.get('cors', true))
    app.use(cors());

  app.use(router());
  return app;
}
