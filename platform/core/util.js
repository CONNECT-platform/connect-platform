const script = require('./script');


const buildFromFactoryOrClass = factoryOrClass => {
  if (factoryOrClass.toString().startsWith('class'))
    return new factoryOrClass();
  else
    return factoryOrClass();
}

module.exports = {
  buildFromFactoryOrClass: buildFromFactoryOrClass,
}
