const chai = require('chai');
const registry = require('../../../core/registry');
const Routes = require('../routes');
const sinon = require('sinon');
const expect = require('chai').expect;

const routes = new Routes(registry, 'public');

describe('routes', () => {
  it('should add public route when published.', () => {
    const publicPath1Signature = {
      path: "/test/public/path1",
      public: true,
      method: "get",
      controlOutputs: [ "done" ]
    };

    registry.publish(registry.events.registered, { signature: publicPath1Signature });
    
    expect(routes.get())
      .to.be.an('array')
      .that.includes(publicPath1Signature);
  });
  
  it('should add public two route when published.', () => {
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

    registry.publish(registry.events.registered, { signature: publicPath1Signature });
    registry.publish(registry.events.registered, { signature: publicPath2Signature });
    
    expect(routes.get())
      .to.be.an('array')
      .that.includes(publicPath1Signature)
      .that.includes(publicPath2Signature);
  });

  it('should not add a private route when published.', () => {
    const privatePathSignature = {
      path: "/test/private/path",
      public: false,
      method: "get",
      controlOutputs: [ "done" ]
    };

    registry.publish(registry.events.registered, { signature: privatePathSignature });
    
    expect(routes.get())
      .to.be.an('array')
      .that.does.not.include(privatePathSignature);
  });

  it('should find route with different combinations of leading and trailing slashes.', () => {
    const publicPathSignature = {
      path: "/test/public/path",
      public: true,
      method: "get",
      controlOutputs: [ "done" ]
    };

    registry.publish(registry.events.registered, { signature: publicPathSignature });
    
    expect(routes.find('test/public/path')).to.eql(publicPathSignature);
    expect(routes.find('test/public/path/')).to.eql(publicPathSignature);
    expect(routes.find('/test/public/path')).to.eql(publicPathSignature);
    expect(routes.find('/test/public/path/')).to.eql(publicPathSignature);
  });

  it('should find route from alias.', () => {
    const publicPathSignature = {
      path: "/test/public/path",
      public: true,
      method: "get",
      controlOutputs: [ "done" ]
    };

    registry.register(publicPathSignature, () => {});

    registry.alias('/test-alias', publicPathSignature.path);

    const resolvedPublicPathSignature = {
      ...publicPathSignature,
      path: "/test-alias",
      resolvedPath: "/test/public/path"
    };
    
    expect(routes.find('test-alias')).to.eql(resolvedPublicPathSignature);
  });
});
