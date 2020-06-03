const chai = require('chai');
const chaiHttp = require('chai-http');

const path = require('path');
const files = require('../../../bind/panel/util/file-io');

const deepAssign = require('deep-assign');

const { hashSig } = require('../../../util/hash');

chai.use(chaiHttp);

process.env.CONNECT_PORT = 4041;

const url = `http://127.0.0.1:${process.env.CONNECT_PORT}`;

const deepClone = require('./util/deepClone');
const { deleteNodes, validateDeleteCalls } = require('./util/api');

describe('panel-nodes', () => {
  let requester = null;
  const templateNode = {
    "id":null,
    "signature": {
      "path":"/multi",
      "method":"GET",
      "public":false,
      "socket":true,
      "in":[],
      "out":[],
      "configs":[],
      "control":[],
      "nodes":[],
      "links":[]
    },
    "connect_token": ""
  };

  const templateNodeExpectedSignature = {
    ...templateNode.signature,
    method: ''
  };

  templateNodeExpectedSignature.key = hashSig(templateNodeExpectedSignature);

  before(() => {
    require('../../../../test-app');
    requester = chai.request(url).keepOpen();
  });

  it('Should load node with id and key information.', done => {
    let id = null;

    requester
    .post('/panel/save')
    .send(templateNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      return Promise.resolve(true);
    }).then(() => {
      return requester.get('/panel/nodes').send({ connect_token: '' });
    }).then((res) => {
      res.body.should.have.property('nodes');
      res.body.nodes.should.have.property(templateNode.signature.path);
      res.body.nodes[templateNode.signature.path].should.be.an('array');
      
      res.body.nodes[templateNode.signature.path].should.deep.include({ id, key: templateNodeExpectedSignature.key });
    }).then(() => {
      return deleteNodes(requester, [ id ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });

      deleteNodes(requester, [ id ]).then(() => { done(err); });
    });
  });

  it('Should save newly generated pathmap to file.', done => {
    let id = null;

    requester
    .post('/panel/save')
    .send(templateNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      return Promise.resolve(true);
    }).then(() => {
      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.have.property(templateNode.signature.path);
      pathmap[templateNode.signature.path].should.be.an('array');
      pathmap[templateNode.signature.path].should.have.lengthOf(1);
      pathmap[templateNode.signature.path].should.deep.include({ id, key: templateNodeExpectedSignature.key });
    }).then(() => {
      return deleteNodes(requester, [ id ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });

      deleteNodes(requester, [ id ]).then(() => {
        done(err);
      });
    });
  });
});