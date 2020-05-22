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
    let env;
    const TEST_ENVIRONMENT_VARIABLE = 'TEST_ENVIRONMENT_VARIABLE';
    const ENVIRONMENT_VARIABLE_VALUE = 'test_environment_variable';

    before(() => {
      env = process.env;
      process.env[TEST_ENVIRONMENT_VARIABLE] = ENVIRONMENT_VARIABLE_VALUE;
    });

    it('should add value to the config.', () => {
      let c = config({x : 2});
      
      c.setFromEnvVariable('y', TEST_ENVIRONMENT_VARIABLE);
      
      c.has('y').should.be.true;
      c.get('y').should.equal(ENVIRONMENT_VARIABLE_VALUE);
    });

    it('should override the config when key already has a value.', () => {
      let c = config({y : 'SOMETHING_ELSE'});
      
      c.setFromEnvVariable('y', TEST_ENVIRONMENT_VARIABLE);
      
      c.has('y').should.be.true;
      c.get('y').should.equal(ENVIRONMENT_VARIABLE_VALUE);
    });

    it('should set value to the config for a nested path.', () => {
      let c = config({x : { y: { z: 'SOMETHING_ELSE'} } });
      
      c.setFromEnvVariable('x.y.z', TEST_ENVIRONMENT_VARIABLE);
      
      c.has('x').should.be.true;
      c.get('x').y.z.should.equal(ENVIRONMENT_VARIABLE_VALUE);
    });

    after(function () {
      process.env = env;
    });
  });

  describe('.autoparseFromEnvironmentVars()', () => {
    let env;
    const TEST_ENVIRONMENT_VARIABLE = 'TEST_ENVIRONMENT_VARIABLE';
    const ENVIRONMENT_VARIABLE_VALUE = 'test_environment_variable';

    const TEST_ENVIRONMENT_VARIABLE2 = 'TEST_ENVIRONMENT_VARIABLE2';
    const ENVIRONMENT_VARIABLE_VALUE2 = 'test_environment_variable2';

    before(() => {
      env = process.env;
      process.env[TEST_ENVIRONMENT_VARIABLE] = ENVIRONMENT_VARIABLE_VALUE;
      process.env[TEST_ENVIRONMENT_VARIABLE2] = ENVIRONMENT_VARIABLE_VALUE2;
    });

    it('should do nothing when there\'s no templated variable.', () => {
      let c = config({
        x: 'random'
      });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').should.equal('random');
    });

    it('should do nothing for value from parsed template but with that isn\'t set in the environment.', () => {
      let c = config({
        x: `{{ NON_EXISTING_ENV_VARIABLE }}`
      });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').should.equal('{{ NON_EXISTING_ENV_VARIABLE }}');
    });

    it('should add value to config from parsed template.', () => {
      let c = config({
        x: `{{ ${TEST_ENVIRONMENT_VARIABLE} }}`
      });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').should.equal(ENVIRONMENT_VARIABLE_VALUE);
    });

    it('should use default value to config from parsed template with no corresponding env variable.', () => {
      let c = config({
        x: `{{ NON_EXISTIN_ENV_VARIABLE || default }}`
      });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').should.equal('default');
    });

    it('should use default value with no whitespace to config from parsed template with no corresponding env variable.', () => {
      let c = config({
        x: `{{ NON_EXISTIN_ENV_VARIABLE ||default }}`
      });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').should.equal('default');
    });

    it('should use default value with multiple whitespaces to config from parsed template with no corresponding env variable.', () => {
      let c = config({
        x: `{{ NON_EXISTIN_ENV_VARIABLE ||       default     }}`
      });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').should.equal('default');
    });

    it('should add value to config from parsed template while keeping other content.', () => {
      let c = config({
        x: `randomContent{{ ${TEST_ENVIRONMENT_VARIABLE} }}`
      });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').should.equal(`randomContent${ENVIRONMENT_VARIABLE_VALUE}`);
    });

    it('should add values to config from multiple parsed templates.', () => {
      let c = config({
        x: `{{ ${TEST_ENVIRONMENT_VARIABLE} }}{{ ${TEST_ENVIRONMENT_VARIABLE2} }}`
      });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').should.equal(`${ENVIRONMENT_VARIABLE_VALUE}${ENVIRONMENT_VARIABLE_VALUE2}`);
    });

    it('should set value to the config for a nested path.', () => {
      let c = config({x: { y: { z: `{{ ${TEST_ENVIRONMENT_VARIABLE} }}`} } });
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').y.z.should.equal(ENVIRONMENT_VARIABLE_VALUE);
    });

    it('should set values to the config for nested paths from multiple parsed templates.', () => {
      let c = config(
        {
          x: {
            y: {
              z: `{{ ${TEST_ENVIRONMENT_VARIABLE} }}`,
              w: `{{ ${TEST_ENVIRONMENT_VARIABLE2} }}`
            }
          },
          y: {
            z: `{{ ${TEST_ENVIRONMENT_VARIABLE} }}_{{ ${TEST_ENVIRONMENT_VARIABLE2} }}`
          }
        }
      );
      
      c.autoparseFromEnvironmentVars();
      
      c.has('x').should.be.true;
      c.get('x').y.z.should.equal(ENVIRONMENT_VARIABLE_VALUE);
      c.get('x').y.w.should.equal(ENVIRONMENT_VARIABLE_VALUE2);
      c.get('y').z.should.equal(`${ENVIRONMENT_VARIABLE_VALUE}_${ENVIRONMENT_VARIABLE_VALUE2}`);
    });

    after(function () {
      process.env = env;
    });
  });

  describe('.setServiceURLFromEnvVariable()', () => {
    const TEST_ENVIRONMENT_VARIABLE = 'TEST_ENVIRONMENT_VARIABLE';
    const TEST_SERVICE_NAME = 'test_service';
    const ENVIRONMENT_VARIABLE_SERVICE_URL = 'http://test_service';

    before(() => {
      process.env[TEST_ENVIRONMENT_VARIABLE] = ENVIRONMENT_VARIABLE_SERVICE_URL;
    });

    it('should add service.', () => {
      let c = config({x : 2});
      
      c.setServiceURLFromEnvVariable(TEST_SERVICE_NAME, TEST_ENVIRONMENT_VARIABLE);
      
      const nodes = c.get('nodes');
      
      c.has('nodes').should.be.true;
      nodes.should.have.property('service');
      nodes.service.should.be.an('array');
      nodes.service.should.deep.include({ name: TEST_SERVICE_NAME, url: ENVIRONMENT_VARIABLE_SERVICE_URL });
    });

    it('should override an existing service URL config.', () => {      
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
