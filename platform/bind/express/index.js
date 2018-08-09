const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router');
const init = require('./init');


module.exports = (app, config) => {
  if (!app) app = init();

  app.use(bodyParser.json());

  if (config.get('cors', true))
    app.use(cors());

  app.use(router(config));

  if (config.get('interconnectible', true))
    app.get('/api', (req, res) => {
      res.status(200).send(router.public());
    });

  return app;
}
