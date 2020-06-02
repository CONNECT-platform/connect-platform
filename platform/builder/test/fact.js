const assert = require('assert');
const path = require('path');
const fs = require('fs');
const core = require('../../core');
const { Builder } = require('../builder');
const fromJSON = require('../from-json');
const { hashSig } = require('../../bind/panel/util/hash');

describe('*** Magnificent Factoriel Composite ***', () => {
  it('should calculate 5!', done => {
    fs.readFile(path.join(__dirname, 'fact-recipe.json'), 'utf-8', (err, json) => {
      new Builder().build(fromJSON(json));

      console.log('reg', core.registry._paths);
      console.log('json', json);
      let f = core.callable(() => core.registry.instance('/test/fact/', hashSig(json)));
      f({n : 5}).then(res => {
        assert.equal(res.data, 120);
        done();
      });
    });
  });
});
