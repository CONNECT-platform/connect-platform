const assert = require('assert');
const core = require('../../core');
const { Builder } = require('../builder');
const { Recipe } = require('../recipe');
const { Composition } = require('../composition');


describe('Builder', () => {
  describe('.build()', () => {
    it('should build a composite factory from given recipe and its own config.', done => {
      let builder = new Builder({user: 'Mr.Anderson'});
      let recipe = new Recipe();
      recipe.add(c => c.addInput('subject'))
        .add(c => c.addOutput('msg'))
        .add(c => c.addConfig('user'))
        .add(c => c.addExpr('e', ['subject', 'user'], '`${subject} ${user}!`'))
        .add(c => c.inputs.subject.connect(c.nodes.e.pins.in.subject))
        .add(c => c.configs.user.connect(c.nodes.e.pins.in.user))
        .add(c => c.outputs.msg.connect(c.nodes.e.pins.result));

      let c = core.callable(builder.build(recipe));
      c({subject: 'Welcome back'}).then(({output, data}) => {
        assert.equal(output, 'msg');
        assert.equal(data, 'Welcome back Mr.Anderson!');
        done();
      });
    });

    it('should register the factory by default.', () => {
      let recipe = new Recipe({path: '/test/builder/r'}).add();
      let builder = new Builder();
      builder.build(recipe);

      assert(core.registry.registered('/test/builder/r'));
    });

    it('should skip registration when asked to.', () => {
      let recipe = new Recipe({path: '/test/builder/rnot'}).add();
      let builder = new Builder();
      builder.build(recipe, true);

      assert(!core.registry.registered('/test/builder/rnot'));
    });
  });
});
