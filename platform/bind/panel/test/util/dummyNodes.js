const { hashSig } = require('../../../../util/hash');

const deepAssign = require('deep-assign');
const deepClone = require('./deepClone');

const socketNode = {
  node: {
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
  }
};

socketNode.expectedSignature = {
  ...socketNode.node.signature,
  method: ''
};

socketNode.expectedSignature.key = hashSig(socketNode.expectedSignature);

const publicPostNode = {
  node: deepAssign(deepClone(socketNode.node), {
    signature: {
      public: true,
      method: "POST",
      socket: false
    }
  })
};

publicPostNode.expectedSignature = {
  ...socketNode.expectedSignature,
  public: publicPostNode.node.signature.public,
  method: publicPostNode.node.signature.method,
  socket: publicPostNode.node.signature.socket,
};

publicPostNode.expectedSignature.key = hashSig(publicPostNode.expectedSignature);

const internalNode = {
  node: deepAssign(deepClone(socketNode.node), {
    signature: {
      public: false,
      method: 'get',
      socket: false
    }
  })
};

internalNode.expectedSignature = {
  ...socketNode.expectedSignature,
  public: internalNode.node.signature.public,
  method: '',
  socket: internalNode.node.signature.socket,
};

internalNode.expectedSignature.key = hashSig(internalNode.expectedSignature);

module.exports.template = {
  socket: socketNode,
  publicPost: publicPostNode,
  internal: internalNode
};