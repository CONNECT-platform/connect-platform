const { Router } = require('express');
const core = require('../../core');
const reqHandler = require('./req-handler');


const gatherPublicRoutes = () => {
  let res = [];
  for (let [path, methods] of Object.entries(core.registry.registrants)) {
    for(let method in methods) {
      const signature = methods[method].signature;
      if(
        ('public' in signature) &&
        signature.public
      ) {
        res.push(signature);
      }
    }
  }

  return res;
}

const buildRouter = () => {
  let router = Router();

  for (let signature of gatherPublicRoutes()) {
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
module.exports.public = gatherPublicRoutes;
