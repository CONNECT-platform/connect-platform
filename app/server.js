const config = require('./config');

module.exports = app => {
  var _server = app.listen(config.server.port.valueOf(), () => {
    var host = _server.address().address;
    var port = _server.address().port;

    console.log(config.server.name.valueOf() + " is online @ http://%s:%s", host, port);
  });

  return _server;
};
