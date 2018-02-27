const { Router } = require('express');
const core = require('../../core');
const reqHandler = require('./req-handler');


const gatherPublicRoutes = () => {
  let res = [];
  for (let [path, {signature}] of Object.entries(core.registry.registrants)) {
    if (signature.public)
      res.push(signature);
  }

  return res;
}

const buildRouter = () => {
  let router = Router();
  for (let signature of gatherPublicRoutes()) {
    let handler = reqHandler(() => core.registry.instance(signature.path));
    let method = (signature.method)?(signature.method.toLowerCase()):('get');

    if (method.toLowerCase() == 'get') router.get(signature.path, handler);
    if (method.toLowerCase() == 'post') router.post(signature.path, handler);
    if (method.toLowerCase() == 'put') router.put(signature.path, handler);
    if (method.toLowerCase() == 'delete') router.delete(signature.path, handler);
  }

  return router;
}

module.exports = buildRouter;
