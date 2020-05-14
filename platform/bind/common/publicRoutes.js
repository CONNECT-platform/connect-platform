const core = require('../../core');


module.exports = () => {
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