const chai = require('chai');
const io = require('socket.io-client');
const should = require('chai').should();
const sinon = require('sinon');
const axios = require('axios');

const platform = require('../../..');

function setDefaultConnectHandler() {
  platform.core.node({path: '/disconnect',
    public: false,
    socket: true,
    inputs: [ 'id' ],
    controlOutputs: ['done'],
  }, function(i, o, c, _, context) {
    c('done');
  });
}

function setDefaultDisconnectHandler() {
  platform.core.node({path: '/disconnect',
    public: false,
    socket: true,
    inputs: [ 'id' ],
    controlOutputs: ['done'],
  }, function(i, o, c, _, context) {
    c('done');
  });
}

describe('socket.io', () => {
  let socket = null;
  let server = null;
  let url = null;

  beforeEach(function(done) {
    setDefaultConnectHandler();
    setDefaultDisconnectHandler();
            
    platform.configure({
      enable_sockets: true,
      port: 4321
    });
  
    platform.start()
    .then(serv => {
      server = serv;
      url = `http://127.0.0.1:${serv.address().port}`;

      socket = io.connect(url, {
          'reconnection delay' : 0,
          'reopen delay' : 0,
          'force new connection' : true,
          transports: ['websocket']
      });

      socket.on('disconnect', function() { });

      socket.on('connect', function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    if(socket.connected) {
      socket.on('disconnect', () => {
        server.close();
        done();
      });

      socket.disconnect();
    } else {
      console.warn('no connection to break...');

      server.close();
      done();
    }
  });

  it('should call the connect event node through when connecting', done => {
    platform.core.node({path: '/connect',
      public: false,
      socket: true,
      inputs: [ 'id' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) {
      c('done');
    });

    let socket = io.connect(url, {
      'reconnection delay' : 0,
      'reopen delay' : 0,
      'force new connection' : true,
      transports: ['websocket']
    });

    socket.on('disconnect', () => {
      done();
    });

    socket.on('connect', () => {
      socket.disconnect();
    });
  });

  it('should add a socket to the sockets object after connecting', done => {
    const socket = io.connect(url, {
      'reconnection delay' : 0,
      'reopen delay' : 0,
      'force new connection' : true,
      transports: ['websocket']
    })

    socket.on('connect', () => {
      platform.sockets.has(socket.id).should.be.true;
      done();
    });
  });

  it('should remove a socket from the sockets object after disconnect', done => {
    let socketId = null;

    platform.core.node({path: '/disconnect',
      public: false,
      socket: true,
      inputs: [ 'id' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) {
      setDefaultDisconnectHandler();
      c('done');
    });

    let socket = io.connect(url, {
      'reconnection delay' : 0,
      'reopen delay' : 0,
      'force new connection' : true,
      transports: ['websocket']
    });

    socket.on('connect', () => {
      socketId = socket.id;
      socket.disconnect();
    });

    function onRemoved(event) {
      console.log({ event });
      platform.sockets.has(socketId).should.be.false;
      platform.sockets.unsubscribe(platform.sockets.events.removed, onRemoved);

      done();
    }

    platform.sockets.subscribe(platform.sockets.events.removed, onRemoved);
  });

  it('should call the disconnect event node through when connecting.', done => {
    platform.core.node({path: '/disconnect',
      public: false,
      socket: true,
      inputs: [ 'id' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) {
      setDefaultDisconnectHandler();
      done();
      c('done');
    });

    socket.disconnect();
  });

  it('should call connect node through a socket event and get an event back.', done => {
    platform.core.node({path: '/test/bind/socket.io',
      public: false,
      socket: true,
      inputs: [ 'test' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) { context.socket.emit('test', i.test); c('done'); });
    
    socket.emit('/test/bind/socket.io', { test: 'testing response' });
    socket.on('test', (req) => {
      req.should.equal('testing response')
      done();
    });
  });

  it('should call connect aliased node through a socket event and get an event back.', done => {
    platform.core.node({path: '/test/bind/socket.io',
      public: false,
      socket: true,
      inputs: [ 'test' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) { context.socket.emit('test', i.test); c('done'); });
    
    platform.core.registry.alias('/testSocket', '/test/bind/socket.io');

    socket.emit('/testSocket', { test: 'testing response' });
    socket.on('test', (req) => {
      req.should.equal('testing response');
      done();
    });
  });

  it('should call connect node through a socket event and call callback.', done => {
    const callbackUrl = 'http://localhost/test';
    const CONTROL_NAME = 'done';
    const RESPONSE_EVENT_NAME = 'test_event';
    const TEST_RESPONSE = 'testing response';

    const stub = sinon.stub(axios, 'post').resolves(Promise.resolve({ data: {} }));

    platform.core.node({path: '/test/bind/socket.io',
      public: false,
      socket: true,
      inputs: [ 'test' ],
      controlOutputs: [CONTROL_NAME],
    }, function(i, o, c, _, context) {
      context.socket.emit(RESPONSE_EVENT_NAME, i.test);
      c(CONTROL_NAME);
    });
    
    socket.emit('/test/bind/socket.io', { test: TEST_RESPONSE }, callbackUrl);

    socket.on(RESPONSE_EVENT_NAME, (req) => {
      req.should.equal(TEST_RESPONSE);
      sinon.assert.calledWith(stub, callbackUrl, { control: CONTROL_NAME });
      done();
    });
  });

  it('should call connect node through a socket event with missing parameters and get an error back.', done => {
    platform.core.node({path: '/test/bind/socket.io',
      public: false,
      socket: true,
      inputs: [ 'test' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) { c('done'); });
    
    socket.on('call_error', (req) => {
      req.status.should.equal(400);
      done();
    });

    socket.emit('/test/bind/socket.io', { });
  });

  it('should return 404 event when node does not exist.', done => {
    socket.on('call_error', (req) => {
      req.status.should.equal(404);
      done();
    });

    socket.emit('/test/bind/non_existing', { });
  });
});
