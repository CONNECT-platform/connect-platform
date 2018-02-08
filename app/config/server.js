const env = require('./env');
const util = require('./util');

module.exports = {
  port: util.variant(() => env.development,
    {
      true: 3000,
    }),
  name: util.variant(() => env.development,
    {
      true: "Connect Platform Development Server",
      false: "Connect Platform Production Server",
    }),
}
