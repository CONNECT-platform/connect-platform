const safeEval = require('safe-eval');


const buildFromFactoryOrClass = factoryOrClass => {
  if (factoryOrClass.toString().startsWith('class'))
    return new factoryOrClass();
  else
    return factoryOrClass();
}

const evaluate = (expr, context) => {
  return safeEval(expr, context);
}

module.exports = {
  buildFromFactoryOrClass: buildFromFactoryOrClass,
  evaluate: evaluate,
}
