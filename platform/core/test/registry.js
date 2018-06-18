const assert = require('assert');
const base = require('../base');
const registry = require('../registry');
const { UnregisteredPath } = require('../errors');


describe('registry', () => {
  describe('.register()', () => {
    it('should register a node class or factory with given path.', () => {
      registry.register({path: 'X'}, base.node.Node);
      registry.register({path: 'Y'}, () => new base.node.Node());

      assert(registry.registered('X'));
      assert(registry.registered('Y'));
    });

    it('should override with subsequent registration.', () => {
      class A extends base.node.Node{};
      class B extends base.node.Node{};

      registry.register({path: 'X'}, A);
      assert(registry.instance('X') instanceof A);

      registry.register({path: 'X'}, B);
      assert(registry.instance('X') instanceof B);
    });
  });

  describe('.instance()', () => {
    it('should return an instance of a registered class or factory.', () => {
      class A extends base.node.Node{};
      class B extends base.node.Node{};

      registry.register({path: 'X'}, A);
      registry.register({path: 'Y'}, () => new B());

      assert(registry.instance('X') instanceof A);
      assert(registry.instance('Y') instanceof B);
    });

    it('should throw proper error when given path is not registered.', () => {
      assert.throws(() => {
        registry.instance('XX/123456');
      }, UnregisteredPath);
    });
  });

  describe('.signature()', () => {
    it('should return the signature of a registered node class or factory.', ()=> {
      registry.register({path: 'X', inputs: ['a']}, base.node.Node);
      assert.equal(registry.signature('X').inputs[0], 'a');
    });

    it('should throw proper error when given path is not registered.', () => {
      assert.throws(() => {
        registry.signature('XX/123456');
      }, UnregisteredPath);
    });
  });

  describe('.alias()', () => {
    it('should make an alias for a given path.', () => {
      class A extends base.node.Node{};
      registry.register({path: 'X'}, A);

      assert.throws(() => {
        registry.instance('X-alias');
      }, UnregisteredPath);

      registry.alias('X-alias', 'X');

      assert(registry.instance('X-alias') instanceof A);
    });

    it('should be able to resolve chain alaising as well.', () => {
      registry.alias('XZZ', 'WZZ');
      registry.alias('WZZ', 'ZZZ');

      class D extends base.node.Node{};
      registry.register({path: 'ZZZ'}, D);

      assert(registry.instance('WZZ') instanceof D);
    });
  });

  describe('mocking:', () => {
    class Original extends base.node.Node{};
    class Mocked extends base.node.Node{};

    registry.register({path: '/RTest/mock-test-path'}, Original);

    describe('.mock()', () => {
      it('should replace a mock object for given path:', () => {
        registry.mock('/RTest/mock-test-path', Mocked);
        assert(registry.instance('/RTest/mock-test-path') instanceof Mocked);
      });
    });

    describe('.mocked()', () => {
      it('should verify that a specific path is mocked.', () => {
        assert(!registry.mocked('/RTest/mock-test-path-2'));
        assert(registry.mocked('/RTest/mock-test-path'));
      });
    });

    describe('.unmock()', () => {
      it('should remove the mock and return to normal behavior.', () => {
        registry.unmock('/RTest/mock-test-path');
        assert(!registry.mocked('/RTest/mock-test-path'));
        assert(registry.instance('/RTest/mock-test-path') instanceof Original);
      });
    });
  });
});
