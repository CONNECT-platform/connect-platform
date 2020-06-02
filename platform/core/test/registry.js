const assert = require('assert');
const base = require('../base');
const registry = require('../registry');
const { UnregisteredPath } = require('../errors');
const chai = require('chai');
const sinon = require('sinon');

const hash = require('../../util/hash');

describe('registry', () => {
  describe('.register()', () => {
    it('should register a node class or factory with given path.', () => {
      registry.register({path: 'X'}, base.node.Node);
      registry.register({path: 'Y'}, () => new base.node.Node());

      assert(registry.registered('X'));
      assert(registry.registered('Y'));
    });

    it('should register a node class or factory with given path and method.', () => {
      registry.register({path: 'X', method: 'GET'}, base.node.Node);
      registry.register({path: 'Y', method: 'POST'}, () => new base.node.Node());

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

    it('should override with subsequent registration with method.', () => {
      class C extends base.node.Node{};
      class D extends base.node.Node{};

      const signatureGet = {path: 'X', public: true, method: 'get'};
      const sigHash = hash.hashSig(signatureGet);

      registry.register(signatureGet, C);
      assert(registry.instance('X', sigHash) instanceof C);
      
      registry.register(signatureGet, D);
      assert(registry.instance('X', sigHash) instanceof D);
    });

    it('should override with subsequent registration with key.', () => {
      const TEST_KEY = 'test_key';
      class C extends base.node.Node{};
      class D extends base.node.Node{};

      registry.register({path: 'X', key: TEST_KEY}, C);
      assert(registry.instance('X', TEST_KEY) instanceof C);
      
      registry.register({path: 'X', key: TEST_KEY}, D);
      assert(registry.instance('X', TEST_KEY) instanceof D);
    });

    it('should not override with subsequent registration with a unique key.', () => {
      const TEST_KEY = 'test_key';
      const TEST_KEY2 = 'test_key2';
      
      class C extends base.node.Node{};
      class D extends base.node.Node{};

      registry.register({path: 'X', key: TEST_KEY}, C);
      assert(registry.instance('X', TEST_KEY) instanceof C);
      
      registry.register({path: 'X', key: TEST_KEY2}, D);
      assert(registry.instance('X', TEST_KEY2) instanceof D);
    });

    it('should register a node class or factory with the root path.', () => {
      registry.register({path: '/'}, base.node.Node);

      assert(registry.registered(''));

      assert(registry.registered('/'));
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

    it('should return an instance of a registered class on the root endpoint.', () => {
      class A extends base.node.Node{};

      registry.register({path: '/'}, A);

      assert(registry.instance('/') instanceof A);
      assert(registry.instance('') instanceof A);
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

    it('should return the signature of a registered node class or factory with method.', ()=> {
      const sig = {path: 'X', inputs: ['a'], public: true, method: 'post'};
      registry.register(sig, base.node.Node);

      assert.equal(registry.signature('X', hash.hashSig(sig)).inputs[0], 'a');
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
      it('should replace a mock object for given path.', () => {
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

  describe('.registrants', () => {
    it('should make an alias for a given path.', () => {
      const TEST_KEY1 = 'test_key1';
      const TEST_KEY2 = 'test_key2';
      const TEST_KEY3 = 'test_key3';

      class A extends base.node.Node{};
      class B extends base.node.Node{};
      class C extends base.node.Node{};

      const signatureA = {path: 'Multi', method: 'get', public: true, key: TEST_KEY1 };
      const signatureB = {path: 'Multi', method: 'post', public: true, key: TEST_KEY2 };
      const signatureC = {path: 'Multi', method: 'get', socket: true, key: TEST_KEY3 };

      registry.register(signatureA, A);
      registry.register(signatureB, B);
      registry.register(signatureC, C);

      registry.registrants.should.have.property('Multi');

      registry.registrants['Multi'].should.have.property(TEST_KEY1);
      registry.registrants['Multi'].should.have.property(TEST_KEY2);
      registry.registrants['Multi'].should.have.property(TEST_KEY3);
      
      registry.registrants['Multi'][TEST_KEY1].signature.should.eql(signatureA);
      registry.registrants['Multi'][TEST_KEY2].signature.should.eql(signatureB);
      registry.registrants['Multi'][TEST_KEY3].signature.should.eql(signatureC);
    });
  });

  describe('.keyIfNotSet()', () => {
    let sandbox = null;
    const TEST_HASH = 'test_hash';

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return the key if it is defined.', () => {
      const key = registry.keyIfNotSet('random_key', {});

      key.should.equal('random_key');
    });

    it('should get a new key if not already set.', () => {     
      const stub = sandbox.stub(hash, 'hashSig').returns(TEST_HASH);
       
      const key = registry.keyIfNotSet(undefined, {
        path: '/test'
      });

      sandbox.assert.calledOnce(hash.hashSig);

      key.should.equal(TEST_HASH);
    });
  });

  describe('.reset()', () => {
    let sandbox = null;
    let stub = null;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      
      resetMocksStub = sandbox.stub(registry, 'resetMocks');
      resetPathsStub = sandbox.stub(registry, 'resetPaths');
      resetAliasesStub = sandbox.stub(registry, 'resetAliases');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should call mocks, paths and aliases reset methods.', () => {
      registry.reset();

      sandbox.assert.calledOnce(resetMocksStub);
      sandbox.assert.calledOnce(resetPathsStub);
      sandbox.assert.calledOnce(resetAliasesStub);
    });
  });

  describe('.resetMocks()', () => {
    it('should clear mocks.', () => {
      class Original extends base.node.Node{};
      class Mocked extends base.node.Node{};
      
      registry.register({path: '/RTest/mock-test-path'}, Original);      

      registry.mock('/RTest/mock-test-path', Mocked);

      registry.resetMocks();

      registry._mocks.should.eql({});
    });
  });

  describe('.resetPaths()', () => {
    it('should clear paths.', () => {
      class Original extends base.node.Node{};

      registry.register({path: '/test'}, Original);      

      registry.resetPaths();

      registry._paths.should.eql({});
    });
  });
});
