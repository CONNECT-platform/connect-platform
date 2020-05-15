const chai = require('chai');
const registry = require('../../../core/registry');
const routes = require('../routes');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('routes', () => {
  it('should only return public routes.', () => {
    const privatePathSignature = {
      path: "/test/private/path",
      public: false,
      method: "get",
      controlOutputs: [ "done" ]
    };

    const publicPath1Signature = {
      path: "/test/public/path1",
      public: true,
      method: "get",
      controlOutputs: [ "done" ]
    };

    const publicPath2Signature = {
      path: "/test/public/path2",
      public: true,
      method: "post",
      controlOutputs: [ "donsies" ]
    };

    const registrantsStubedResult = {
      "/test/private/path": { get: { signature: privatePathSignature } },
      "/test/public/path": { get: { signature: publicPath1Signature } },
      "/test/public/path2": { get: { signature: publicPath2Signature } }
    };

    let coreMock = sinon.stub(registry, 'registrants').value(registrantsStubedResult);
    
    expect(routes.public())
      .to.be.an('array')
      .that.includes(publicPath1Signature)
      .that.includes(publicPath2Signature)
      .that.does.not.include(privatePathSignature);
  });
});
