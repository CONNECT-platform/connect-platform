const { Router } = require('express');
const core = require('../../core');
const reqHandler = require('./req-handler');
const Routes = require('../common/routes');

const { hashSig } = require('../../util/hash');

const publicRoutes = new Routes(core.registry, 'public');

const buildRouter = () => {
  let router = Router();

  for (let signature of publicRoutes.get()) {
    let method = (signature.method) ? (signature.method.toLowerCase()) : 'get';
    let handler = null;
    try {
      handler = reqHandler(() => core.registry.instance(signature.path, hashSig(signature)), signature);
    } catch(err) {
      handler = reqHandler(() => core.registry.instance(signature.path, method), signature);
    }

    if (method == 'get') router.get(signature.path, handler);
    if (method == 'post') router.post(signature.path, handler);
    if (method == 'put') router.put(signature.path, handler);
    if (method == 'delete') router.delete(signature.path, handler);
  }

  return router;
}

module.exports = buildRouter;
module.exports.routes = publicRoutes;
