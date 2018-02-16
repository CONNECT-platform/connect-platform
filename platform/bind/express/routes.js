const { Router } = require('express');
const core = require('../../core');


const gatherPublicRoutes = () => {
  let res = [];
  for (let [path, {signature}] of Object.entries(core.registry.registrants)) {
    if (signature.public)
      res.push(signature);
  }

  return res;
}

module.exports = {
  gatherPublicRoutes: gatherPublicRoutes,
}
