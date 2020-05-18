const should = require('chai').should();
const config = require('../config');


describe('config', () => {
  describe('.has()', () => {
    it('should say whether the config has given key.', () => {
      let c = config({x : 2});

      c.has('x').should.be.true;
      c.has('y').should.be.false;
    });
  });

  describe('.get()', () => {
    it('should retrieve the value associated with given key.', () => {
      let c = config({x : 2});

      c.get('x').should.equal(2);
    });

    it('should return undefined if no value is given.', () => {
      let c = config();

      should.not.exist(c.get('x'));
    });
  });

  describe('.append()', () => {
    it('should add values to the config.', () => {
      let c = config({x : 2});
      c.append({y : 3});
      c.has('y').should.be.true;
      c.get('y').should.equal(3);
    });

    it('should override already existing values.', () => {
      let c = config({x : 2, y : 3});
      c.append({y : 4, z : 5});
      c.has('z').should.be.true;
      c.get('y').should.equal(4);
    });

    it('should append array values.', () => {
      let c = config({x : ['somehow', 'someone']});
      c.append({x : ['somewhere']});
      c.get('x').should.include('somewhere');
    });

    it('should not append duplicate array values.', () => {
      let c = config({x : ['a', 'b', 'c']});
      c.append({x : ['a', 'd']});
      c.get('x').should.deep.equal(['a', 'b', 'c', 'd']);
    });

    it('should append arrays at any depth.', () => {
      let c = config({x : {y : ['a', 'b']}});
      c.append({x : {y : ['c']}});
      c.get('x').y.should.include('c');
    });

    it('should extend and override dictionary values.', () => {
      let c = config({x : {y : 2, z : 3}});
      c.append({x : {z : 4, w : 5}});
      c.get('x').should.have.property('w');
      c.get('x').z.should.equal(4);
    });

    it('should extend and override dictionaries at any depth.', () => {
      let c = config({a : {x : {y : 2, z : 3}}});
      c.append({a : {x : {z : 4, w : 5}}});
      c.get('a').x.should.have.property('w');
      c.get('a').x.z.should.equal(4);
    });
  });

  describe('.setFromEnvVariable()', () => {
    it('should add value to the config.', () => {
      let c = config({x : 2});
      
      const TEST_ENVIRONMENT_VARIABLE = 'TEST_ENVIRONMENT_VARIABLE';
      const ENVIRONMENT_VARIABLE_VALUE = 'test_environment_variable';
      process.env[TEST_ENVIRONMENT_VARIABLE] = ENVIRONMENT_VARIABLE_VALUE;
      
      c.setFromEnvVariable('y', TEST_ENVIRONMENT_VARIABLE);
      
      c.has('y').should.be.true;
      c.get('y').should.equal(ENVIRONMENT_VARIABLE_VALUE);
    });

    it('should override the config when key already has a value.', () => {
      let c = config({y : 'SOMETHING_ELSE'});
      
      const TEST_ENVIRONMENT_VARIABLE = 'TEST_ENVIRONMENT_VARIABLE';
      const ENVIRONMENT_VARIABLE_VALUE = 'test_environment_variable';
      process.env[TEST_ENVIRONMENT_VARIABLE] = ENVIRONMENT_VARIABLE_VALUE;
      
      c.setFromEnvVariable('y', TEST_ENVIRONMENT_VARIABLE);
      
      c.has('y').should.be.true;
      c.get('y').should.equal(ENVIRONMENT_VARIABLE_VALUE);
    });

    it('should set value to the config for a nested path.', () => {
      let c = config({x : { y: { z: 'SOMETHING_ELSE'} } });
      
      const TEST_ENVIRONMENT_VARIABLE = 'TEST_ENVIRONMENT_VARIABLE';
      const ENVIRONMENT_VARIABLE_VALUE = 'test_environment_variable';
      process.env[TEST_ENVIRONMENT_VARIABLE] = ENVIRONMENT_VARIABLE_VALUE;
      
      c.setFromEnvVariable('x.y.z', TEST_ENVIRONMENT_VARIABLE);
      
      c.has('x').should.be.true;
      c.get('x').y.z.should.equal(ENVIRONMENT_VARIABLE_VALUE);
    });
  });

  describe('.setServiceURLFromEnvVariable()', () => {
    it('should add service.', () => {
      let c = config({x : 2});
      
      const TEST_ENVIRONMENT_VARIABLE = 'TEST_ENVIRONMENT_VARIABLE';
      const TEST_SERVICE_NAME = 'test_service';
      const ENVIRONMENT_VARIABLE_SERVICE_URL = 'http://test_service';
      process.env[TEST_ENVIRONMENT_VARIABLE] = ENVIRONMENT_VARIABLE_SERVICE_URL;
      
      c.setServiceURLFromEnvVariable(TEST_SERVICE_NAME, TEST_ENVIRONMENT_VARIABLE);
      
      const nodes = c.get('nodes');
      
      c.has('nodes').should.be.true;
      nodes.should.have.property('service');
      nodes.service.should.be.an('array');
      nodes.service.should.deep.include({ name: TEST_SERVICE_NAME, url: ENVIRONMENT_VARIABLE_SERVICE_URL });
    });

    it('should override an existing service URL config.', () => {
      const TEST_ENVIRONMENT_VARIABLE = 'TEST_ENVIRONMENT_VARIABLE';
      const TEST_SERVICE_NAME = 'test_service';
      const ENVIRONMENT_VARIABLE_SERVICE_URL = 'http://test_service';
      process.env[TEST_ENVIRONMENT_VARIABLE] = ENVIRONMENT_VARIABLE_SERVICE_URL;
      
      let c = config({
        y : 'SOMETHING_ELSE',
        nodes: {
          service: [
            { name: TEST_SERVICE_NAME, url: 'http://random_url' }
          ]
        }
      });

      c.setServiceURLFromEnvVariable(TEST_SERVICE_NAME, TEST_ENVIRONMENT_VARIABLE);
      
      const nodes = c.get('nodes');
      nodes.service.should.deep.include({ name: TEST_SERVICE_NAME, url: ENVIRONMENT_VARIABLE_SERVICE_URL });
    });
  });

  describe('.core', () => {
    it('should return a proxy dict handled by the config object.', () => {
      let c = config();
      let d = c.core;

      c.append({x : {y : 2, z : 3, arr : ['a', 'b']}});

      d.x.z.should.equal(3);

      c.append({x : {z : 4, w : 5, arr: ['c']}});

      d.x.z.should.equal(4);
      d.x.w.should.equal(5);
      d.x.arr.should.have.members(['a', 'b', 'c']);
    });
  })
});
