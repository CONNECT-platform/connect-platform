const should = require('chai').should();
const hashObject = require('object-hash');
const sinon = require('sinon');

const proxyquire = require('proxyquire');

describe('hash', () => {
  describe('.hashSig()', () => {
    const TEST_HASH = 'test_hash';
    let sandbox = null;
    let hash = null;
    let stub = null;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      
      stub =
        sandbox.stub()
        .returns(TEST_HASH);

      hash = proxyquire('../hash', {
        'object-hash': stub
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should call object hash function with default parameters (non public, empty method and non socket).', () => {
      const sigBefore = { path: '' };
      const sigAfter = { path: '', public: false, method: '', socket: false };

      const val = hash.hashSig(sigBefore);

      sandbox.assert.calledWith(stub, sigAfter);
      sandbox.assert.calledOnce(stub);

      val.should.equal(TEST_HASH);
    });

    it('Should call object hash function with no trailing slash default parameters (non public, empty method and non socket).', () => {
      const sigBefore = { path: '/' };
      const sigAfter = { path: '', public: false, method: '', socket: false };

      const val = hash.hashSig(sigBefore);

      sandbox.assert.calledWith(stub, sigAfter);
      sandbox.assert.calledOnce(stub);

      val.should.equal(TEST_HASH);
    });

    it('Should call object hash function with no method for non public routes.', () => {
      const sigBefore = { path: '/', method: 'what' };
      const sigAfter = { path: '', public: false, method: '', socket: false };

      const val = hash.hashSig(sigBefore);

      sandbox.assert.calledWith(stub, sigAfter);
      sandbox.assert.calledOnce(stub);

      val.should.equal(TEST_HASH);
    });
  });
});
