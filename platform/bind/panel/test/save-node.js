const chai = require('chai');
const chaiHttp = require('chai-http');

const path = require('path');
const files = require('../../../bind/panel/util/file-io');

const deepAssign = require('deep-assign');

const { hashSig } = require('../util/hash');

chai.use(chaiHttp);

process.env.CONNECT_PORT = 4041;

const url = `http://127.0.0.1:${process.env.CONNECT_PORT}`;

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

describe('save-node', () => {
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

  function deleteNodes(requester, ids) {
    const promises = [];

    for(let k in ids) {
      if(ids[k]) {
        promises.push(requester.delete(`/panel/delete/${ids[k]}`));
      }
    }

    return Promise.all(promises);
  }

  function validateDeleteCalls(results) {
    for(let k in results) {
      results[k].status.should.equal(200);
      results[k].should.have.property('body');
      results[k].body.should.equal('deleted');
    }
  }

  it('Saves non-existing node correctly.', done => {
    let id = null;

    requester
    .post('/panel/save')
    .send(templateNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('id');

      id = res.body.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(templateNodeExpectedSignature);

      return nodeInfo;
    }).then(() => {
      return deleteNodes(requester, [ id ]);
    }).then((results) => {
      validateDeleteCalls(results);

      done();
    }).catch((err) => {
      console.log({ err });
      return deleteNodes(requester, [ id ]);
    });
  });

  it('Saves non-existing node with correct key.', done => {
    let id = null;

    requester
    .post('/panel/save')
    .send(templateNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('id');

      id = res.body.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(templateNodeExpectedSignature);

      return nodeInfo;
    }).then(() => {
      return deleteNodes(requester, [ id ]);
    }).then((results) => {
      validateDeleteCalls(results);

      done();
    }).catch((err) => {
      console.log({ err });
      return deleteNodes(requester, [ id ]);
    });
  });

  it('Update existing node correctly from signature.', done => {
    let id = null;

    const modifedNodeTemplate = deepAssign(deepClone(templateNode), {
      signature: {
        in: [ 'test-in' ],
        out: [ 'test-out' ]
      }
    });

    const modifedNodeTemplateExpectedSignature = {
      ...templateNodeExpectedSignature,
      in: modifedNodeTemplate.signature.in,
      out: modifedNodeTemplate.signature.out,
    }

    requester
    .post('/panel/save')
    .send(templateNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('id');

      id = res.body.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(templateNodeExpectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(modifedNodeTemplate)
    ).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('id');

      id = res.body.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(modifedNodeTemplateExpectedSignature);

      return nodeInfo;
    }).then(() => {
      return deleteNodes(requester, [ id ]);
    }).then((results) => {
      validateDeleteCalls(results)

      done();
    }).catch((err) => {
      console.log({ err });
      return deleteNodes(requester, [ id ]);
    });
  });

  it('Create node correctly with same path but different signature (internal and public node).', done => {
    let id = null;
    let id2 = null;

    const modifedNodeTemplate = deepAssign(deepClone(templateNode), {
      signature: {
        public: true,
        method: "POST",
        socket: false
      }
    });

    const modifedNodeTemplateExpectedSignature = { ...modifedNodeTemplate.signature };

    modifedNodeTemplateExpectedSignature.key = hashSig(modifedNodeTemplateExpectedSignature);

    requester
    .post('/panel/save')
    .send(templateNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('id');

      id = res.body.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(templateNodeExpectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(modifedNodeTemplate)
    ).then(res => {
        res.status.should.equal(200);
        res.should.have.property('body');
        res.body.should.have.property('id');

        id2 = res.body.id;

        id2.should.not.equal(id);

        let nodefile = path.join('test-app/panel-generated', 'nodes', id2);

        return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(modifedNodeTemplateExpectedSignature);

      return nodeInfo;
    }).then(() => {
      return deleteNodes(requester, [ id, id2 ]);
    }).then((results) => {
      validateDeleteCalls(results);

      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id, id2 ]);
    });
  });

  const socketNode = deepAssign(deepClone(templateNode), {
    signature: {
      public: false,
      method: "GET",
      socket: true
    }
  });

  const socketNodeExpectedSignature = {
    ...templateNodeExpectedSignature,
    public: socketNode.signature.public,
    method: '',
    socket: socketNode.signature.socket
  };

  const publicPostNode = deepAssign(deepClone(templateNode), {
    signature: {
      public: true,
      method: "POST",
      socket: false
    }
  });

  const publicPostNodeExpectedSignature = {
    ...templateNodeExpectedSignature,
    public: publicPostNode.signature.public,
    method: publicPostNode.signature.method,
    socket: publicPostNode.signature.socket,
  };

  publicPostNodeExpectedSignature.key = hashSig(publicPostNodeExpectedSignature);

  it('Create node correctly with same path but different signature (public and socket node).', done => {
    let id = null;
    let id2 = null;

    requester
    .post('/panel/save')
    .send(publicPostNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('id');

      id = res.body.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(publicPostNodeExpectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(socketNode)
    ).then(res => {
        res.status.should.equal(200);
        res.should.have.property('body');
        res.body.should.have.property('id');

        id2 = res.body.id;

        id2.should.not.equal(id);

        let nodefile = path.join('test-app/panel-generated', 'nodes', id2);

        return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(socketNodeExpectedSignature);

      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.have.property(templateNode.signature.path);
      pathmap[templateNode.signature.path].should.include(id);
      pathmap[templateNode.signature.path].should.include(id2);

      return pathmap;
    }).then(() => {
      return deleteNodes(requester, [ id, id2 ]);
    }).then((results) => {
      validateDeleteCalls(results);

      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id, id2 ]);
    });
  });

  it('Create node correctly with same path but different signature (both public nodes but with different methods).', done => {
    let id = null;
    let id2 = null;

    requester
    .post('/panel/save')
    .send(publicPostNode).then(res => {
      res.status.should.equal(200);
      res.should.have.property('body');
      res.body.should.have.property('id');

      id = res.body.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(publicPostNodeExpectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(socketNode)
    ).then(res => {
        res.status.should.equal(200);
        res.should.have.property('body');
        res.body.should.have.property('id');

        id2 = res.body.id;

        id2.should.not.equal(id);

        let nodefile = path.join('test-app/panel-generated', 'nodes', id2);

        return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(socketNodeExpectedSignature);

      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.have.property(templateNode.signature.path);
      pathmap[templateNode.signature.path].should.include(id);
      pathmap[templateNode.signature.path].should.include(id2);

      return pathmap;
    }).then(() => {
      return deleteNodes(requester, [ id, id2 ]);
    }).then((results) => {
      validateDeleteCalls(results);

      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id, id2 ]);
    });
  });

  it('Create node correctly with same path but different signature (internal and socket node).', done => {
    let id = null;
    let id2 = null;

    const internalNode = deepAssign(deepClone(templateNode), {
      signature: {
        public: false,
        method: "GET",
        socket: false
      }
    });

    const internalNodeExpectedSignature = {
      ...templateNodeExpectedSignature,
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
      res.body.should.have.property('id');

      id = res.body.id;

      let nodefile = path.join('test-app/panel-generated', 'nodes', id);

      return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(internalNodeExpectedSignature);

      return nodeInfo;
    }).then(() =>
      requester
      .post('/panel/save')
      .send(socketNode)
    ).then(res => {
        res.status.should.equal(200);
        res.should.have.property('body');
        res.body.should.have.property('id');

        id2 = res.body.id;

        id2.should.not.equal(id);

        let nodefile = path.join('test-app/panel-generated', 'nodes', id2);

        return files.json.load(nodefile);
    }).then(nodeInfo => {
      nodeInfo.should.eql(socketNodeExpectedSignature);

      let pathmapfile = path.join('test-app/panel-generated', 'path-map');
      return files.json.load(pathmapfile, {});
    }).then((pathmap) => {
      pathmap.should.have.property(templateNode.signature.path);
      pathmap[templateNode.signature.path].should.include(id);
      pathmap[templateNode.signature.path].should.include(id2);

      return pathmap;
    }).then(() => {
      return deleteNodes(requester, [ id, id2 ]);
    }).then((results) => {
      validateDeleteCalls(results);

      done();
    }).catch((err) => {
      console.log({ err });
      deleteNodes(requester, [ id, id2 ]);
    });
  });
});