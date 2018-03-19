const core = require('../core');
const { Composition } = require('./composition');
const { Recipe } = require('./recipe');
const { Composite } = require('./composite');


class Builder {
  constructor(config) {
    this._config = config || {};
  }

  build(recipe, skipRegistration) {
    let factory = () => {
      let composition = new Composition();
      recipe.apply(composition);
      return new Composite(composition, this._config);
    };

    if (recipe.signature.path && !skipRegistration) {
      core.registry.register(recipe.signature, factory);
    }

    return factory;
  }
}

module.exports = {
  Builder: Builder,
}
