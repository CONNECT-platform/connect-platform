const proxy = require('http-proxy-middleware');
const { URL } = require('url');

const auth = require('./auth');


const SHELL_URL = 'http://localhost:7681';

module.exports = (credentials, config) => {
  let ttypath = config.path;
  return proxy([ttypath, '/auth_token.js'],
    {
      target: SHELL_URL,
      ws: true,
      changeOrigin: true,
      pathRewrite: path => {
        if (path.startsWith(ttypath)) return path.substr(ttypath.length);
        else return path;
      },
      onProxyReq: (proxyReq, req) => {
        if (req.originalUrl.startsWith(ttypath)) {
          if (req.query.token && auth.verify(req.query.token)) {
            proxyReq.setHeader('Authorization', 'Basic ' + new Buffer(credentials).toString('base64'));
          }
        }
        else if(req.originalUrl == '/auth_token.js') {
          const referer = new URL(req.get('Referer'));
          if (referer.searchParams.has('token') && auth.verify(referer.searchParams.get('token')))
            proxyReq.setHeader('Authorization', 'Basic ' + new Buffer(credentials).toString('base64'));
        }
      },
    }
  );
}
