const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router');
const init = require('./init');


module.exports = (app, config) => {
  if (!app) app = init();

  if (config.has('instance_auto_sleep')) {
    let timeout = config.get('instance_auto_sleep');
    let kill = () => {
      console.log('Killing instance due to inactivity');
      process.exit(0);
    };
    let timer = setTimeout(kill, timeout);
    app.use((req, res, next) => {
      clearTimeout(timer);
      timer = setTimeout(kill, timeout);
      next();
    });
  }

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
