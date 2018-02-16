const bodyParser = require('body-parser');
const router = require('./router');
const init = require('./init');


module.exports = app => {
  if (!app) app = init();
  app.use(bodyParser.json());
  app.use(router());
  return app;
}
