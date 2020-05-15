const chai = require('chai');
const io = require('socket.io-client');
const should = require('chai').should();
const sinon = require('sinon');
const axios = require('axios');

const platform = require('../../../');

describe('socket.io', () => {
  let socket = null;
  let server = null;

  beforeEach(function(done) {
    platform.core.node({path: '/connect',
      public: true,
      method: 'get',
      inputs: [ 'id' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) { console.log('User connected with id:', i.id); c('done'); });
    
    platform.core.node({path: '/disconnect',
      public: true,
      method: 'get',
      inputs: [ 'id' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) { console.log('User disconnected with id:', i.id); c('done'); });
            
    platform.configure({
      enable_sockets: true,
      port: 4321
    });
  
    platform.start()
    .then(serv => {
      server = serv;
      const url = `http://127.0.0.1:${serv.address().port}`;

      socket = io.connect(url, {
          'reconnection delay' : 0,
          'reopen delay' : 0,
          'force new connection' : true,
          transports: ['websocket']
      });

      socket.on('connect', function() {
        done();
      });

      socket.on('disconnect', function() { });
    });
  });

  afterEach(function(done) {
    if(socket.connected) {
        socket.disconnect();
    } else {
        console.warn('no connection to break...');
    }

    server.close();
    done();
  });

  it('should call connect node through a socket event and get an event back.', done => {
    platform.core.node({path: '/test/bind/socket.io',
      public: true,
      method: 'get',
      inputs: [ 'test' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) { context.socket.emit('test', i.test); c('done'); });
    
    socket.emit('/test/bind/socket.io', { test: 'testing response' });
    socket.on('test', (req) => {
      req.should.equal('testing response')
      done();
    });
  });

  it('should call connect node through a socket event and get an event back event without a leading slash in the path.', done => {
    platform.core.node({path: '/test/bind/socket.io',
      public: true,
      method: 'get',
      inputs: [ 'test' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) { context.socket.emit('test', i.test); c('done'); });
    
    socket.emit('test/bind/socket.io', { test: 'testing response' });
    socket.on('test', (req) => {
      req.should.equal('testing response')
      done();
    });
  });

  it('should call connect node through a socket event and get an event back event with a trailing slash in the path.', done => {
    platform.core.node({path: '/test/bind/socket.io',
      public: true,
      method: 'get',
      inputs: [ 'test' ],
      controlOutputs: ['done'],
    }, function(i, o, c, _, context) { context.socket.emit('test', i.test); c('done'); });
    
    socket.emit('/test/bind/socket.io/', { test: 'testing response' });
    socket.on('test', (req) => {
      req.should.equal('testing response')
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
      public: true,
      method: 'get',
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
});
