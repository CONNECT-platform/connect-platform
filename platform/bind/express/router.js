const { Router } = require('express');
const core = require('../../core');
const reqHandler = require('./req-handler');
const routes = require('../common/routes');

const buildRouter = () => {
  let router = Router();

  for (let signature of routes.public()) {
    let handler = reqHandler(() => core.registry.instance(signature.path, method), signature);
    let method = (signature.method) ? (signature.method.toLowerCase()) : ('get');

    if (method == 'get') router.get(signature.path, handler);
    if (method == 'post') router.post(signature.path, handler);
    if (method == 'put') router.put(signature.path, handler);
    if (method == 'delete') router.delete(signature.path, handler);
  }

  return router;
}

module.exports = buildRouter;
module.exports.routes = routes;
