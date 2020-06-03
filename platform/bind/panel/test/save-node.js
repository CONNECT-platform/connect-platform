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

const { template } = require('./util/dummyNodes');

function validateConfFile(id) {
  let confile = path.join('test-app/panel-generated', 'config');
  return files.json.load(confile, {
    nodes : {
      json : [],
    }
  }).then(conf => {
    conf.should.have.property('nodes');
    conf.nodes.should.have.property('json');
    conf.nodes.json.should.be.an('array');
    conf.nodes.json.should.be.include('nodes/' + id);
  });
}

describe('save-node', () => {
  let requester = null;

  before(() => {
    require('../../../../test-app');
    requester = chai.request(url).keepOpen();
  });

  it('Saves non-existing node correctly', done => {
    let id = null;

    requester
    .post('/panel/save')
    .send(template.socket.node).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.socket.expectedSignature);

      return nodeInfo;
    }).then(() => {
      return validateConfFile(id);
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

  it('Saves non-existing node with correct key.', done => {
    let id = null;

    requester
    .post('/panel/save')
    .send(template.socket.node).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.socket.expectedSignature);

      return nodeInfo;
    })
    .then(() => validateConfFile(id))
    .then(() => {
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

  it('Update existing node correctly from signature.', done => {
    let id = null;

    const modifedNodeTemplate = deepAssign(deepClone(template.socket.node), {
      signature: {
        in: [ 'test-in' ],
        out: [ 'test-out' ]
      }
    });

    const modifedNodeTemplateExpectedSignature = {
      ...template.socket.expectedSignature,
      in: modifedNodeTemplate.signature.in,
      out: modifedNodeTemplate.signature.out,
    }

    requester
    .post('/panel/save')
    .send(template.socket.node).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.socket.expectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(modifedNodeTemplate)
    ).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(modifedNodeTemplateExpectedSignature);

      return nodeInfo;
    })
    .then(() => validateConfFile(id))
    .then(() => {
      return deleteNodes(requester, [ id ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id ]).then(() => { done(err); });
    })
  });

  it('Modify existing node correctly by id.', done => {
    let id = null;

    const modifedNodeTemplate = deepAssign(deepClone(template.socket.node), {
      signature: {
        in: [ 'test-in' ],
        out: [ 'test-out' ]
      }
    });

    const modifedNodeTemplateExpectedSignature = {
      ...template.socket.expectedSignature,
      in: modifedNodeTemplate.signature.in,
      out: modifedNodeTemplate.signature.out,
    }

    requester
    .post('/panel/save')
    .send(template.socket.node).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;
      modifedNodeTemplate.id = id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.socket.expectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(modifedNodeTemplate)
    ).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(modifedNodeTemplateExpectedSignature);

      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.have.property(template.socket.node.signature.path);
      
      pathmap[template.socket.node.signature.path].should.deep.include({ id, key: modifedNodeTemplateExpectedSignature.key });

      pathmap[template.socket.node.signature.path].should.have.lengthOf(1);

      return pathmap;
    })
    .then(() => validateConfFile(id))
    .then(() => {
      return deleteNodes(requester, [ id ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id ]).then(() => { done(err); });
    })
  });

  it('Modify existing node\'s path correctly by id.', done => {
    let id = null;

    const modifedNodeTemplate = deepAssign(deepClone(template.socket.node), {
      signature: {
        path: '/multi/test',
        in: [ 'test-in' ],
        out: [ 'test-out' ]
      }
    });

    const modifedNodeTemplateExpectedSignature = {
      ...template.socket.expectedSignature,
      path: modifedNodeTemplate.signature.path,
      in: modifedNodeTemplate.signature.in,
      out: modifedNodeTemplate.signature.out,
    }

    modifedNodeTemplateExpectedSignature.key = hashSig(modifedNodeTemplateExpectedSignature);

    requester
    .post('/panel/save')
    .send(template.socket.node).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;
      modifedNodeTemplate.id = id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.socket.expectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(modifedNodeTemplate)
    ).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(modifedNodeTemplateExpectedSignature);

      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.not.have.property(template.socket.node.signature.path);
      pathmap.should.have.property(modifedNodeTemplateExpectedSignature.path);
      
      pathmap[modifedNodeTemplateExpectedSignature.path].should.deep.include({ id, key: modifedNodeTemplateExpectedSignature.key });

      pathmap[modifedNodeTemplateExpectedSignature.path].should.have.lengthOf(1);

      return pathmap;
    })
    .then(() => validateConfFile(id))
    .then(() => {
      return deleteNodes(requester, [ id ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id ]).then(() => { done(err); });
    })
  });

  it('Create node correctly with same path but different signature (internal and public node).', done => {
    let id = null;
    let id2 = null;

    requester
    .post('/panel/save')
    .send(template.internal.node).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.internal.expectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(template.publicPost.node)
    ).then(res => {
        res.status.should.equal(200);
        res.should.have.property('body');
        res.body.should.have.property('result');
        res.body.result.should.have.property('id');

        id2 = res.body.result.id;

        id2.should.not.equal(id);

        let nodefile = path.join('test-app/panel-generated', 'nodes', id2);

        return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.publicPost.expectedSignature);

      return nodeInfo;
    })
    .then(() => validateConfFile(id))
    .then(() => {
      return deleteNodes(requester, [ id, id2 ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id, id2 ]).then(() => { done(err); });
    });
  });

  it('Create node correctly with same path but different signature (public and socket node).', done => {
    let id = null;
    let id2 = null;

    requester
    .post('/panel/save')
    .send(template.publicPost.node).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.publicPost.expectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(template.socket.node)
    ).then(res => {
        res.status.should.equal(200);
        res.should.have.property('body');
        res.body.should.have.property('result');
        res.body.result.should.have.property('id');

        id2 = res.body.result.id;

        id2.should.not.equal(id);

        let nodefile = path.join('test-app/panel-generated', 'nodes', id2);

        return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.socket.expectedSignature);

      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.have.property(template.socket.node.signature.path);
      
      pathmap[template.socket.node.signature.path].should.deep.include({ id, key: template.publicPost.expectedSignature.key });
      pathmap[template.socket.node.signature.path].should.deep.include({ id: id2, key: template.socket.expectedSignature.key });

      pathmap[template.socket.node.signature.path].should.have.lengthOf(2);

      return pathmap;
    })
    .then(() => validateConfFile(id))
    .then(() => {
      return deleteNodes(requester, [ id, id2 ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id, id2 ]).then(() => { done(err); });
    });
  });

  it('Create node correctly with same path but different signature (both public nodes but with different methods).', done => {
    let id = null;
    let id2 = null;

    requester
    .post('/panel/save')
    .send(template.publicPost.node).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.publicPost.expectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(template.socket.node)
    ).then(res => {
        res.status.should.equal(200);
        res.should.have.property('body');
        res.body.should.have.property('result');
        res.body.result.should.have.property('id');

        id2 = res.body.result.id;

        id2.should.not.equal(id);

        let nodefile = path.join('test-app/panel-generated', 'nodes', id2);

        return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.socket.expectedSignature);

      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.have.property(template.socket.node.signature.path);
      pathmap[template.socket.node.signature.path].should.deep.include({ id, key: template.publicPost.expectedSignature.key });
      pathmap[template.socket.node.signature.path].should.deep.include({ id: id2, key: template.socket.expectedSignature.key });

      pathmap[template.socket.node.signature.path].should.have.lengthOf(2);

      return pathmap;
    })
    .then(() => validateConfFile(id))
    .then(() => {
      return deleteNodes(requester, [ id, id2 ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id, id2 ]).then(() => { done(err); });
    });
  });

  it('Create node correctly with same path but different signature (internal and socket node).', done => {
    let id = null;
    let id2 = null;

    const internalNode = deepAssign(deepClone(template.socket.node), {
      signature: {
        public: false,
        method: "GET",
        socket: false
      }
    });

    const internalNodeExpectedSignature = {
      ...template.socket.expectedSignature,
      public: internalNode.signature.public,
      method: '',
      socket: internalNode.signature.socket,
    };

    internalNodeExpectedSignature.key = hashSig(internalNodeExpectedSignature);

    requester
    .post('/panel/save')
    .send(internalNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('result');
      res.body.result.should.have.property('id');

      id = res.body.result.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(internalNodeExpectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(template.socket.node)
    ).then(res => {
        res.status.should.equal(200);
        res.should.have.property('body');
        res.body.should.have.property('result');
        res.body.result.should.have.property('id');

        id2 = res.body.result.id;

        id2.should.not.equal(id);

        let nodefile = path.join('test-app/panel-generated', 'nodes', id2);

        return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(template.socket.expectedSignature);

      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.have.property(template.socket.node.signature.path);
      pathmap[template.socket.node.signature.path].should.deep.include({ id, key: template.internal.expectedSignature.key });
      pathmap[template.socket.node.signature.path].should.deep.include({ id: id2, key: template.socket.expectedSignature.key });

      pathmap[template.socket.node.signature.path].should.have.lengthOf(2);

      return pathmap;
    })
    .then(() => validateConfFile(id))
    .then(() => {
      return deleteNodes(requester, [ id, id2 ]);
    }).then((results) => {
      return validateDeleteCalls(results);
    }).then(() => {
      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id, id2 ]).then(() => { done(err); });
    });
  });

  it('Fail to create node that is defined as both public and socket at the same time.', done => {
    const absurdNode = deepAssign(deepClone(template.socket.node), {
      signature: {
        public: true,
        method: "GET",
        socket: true
      }
    });

    requester
    .post('/panel/save')
    .send(absurdNode).then(res => {
      res.status.should.equal(200);
      res.body.should.equal('bad_input');

      done();

      return Promise.resolve(true);
    }).catch((err) => {
      console.log({ err });
    });
  });
});