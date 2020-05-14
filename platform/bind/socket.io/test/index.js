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
    console.log('beforeEach');
    platform.configure({
      enable_sockets: true,
      port: 4321
    });
  
    platform.start()
    .then(serv => {
      server = serv;
      const url = `http://127.0.0.1:${serv.address().port}`;

      console.log(`running on ${url}`);

      socket = io.connect(url, {
          'reconnection delay' : 0,
          'reopen delay' : 0,
          'force new connection' : true,
          transports: ['websocket']
      });
      socket.on('connect', function() {
          console.log('connected...');
          done();
      });

      socket.on('disconnect', function() {
          console.log('disconnected...');
      });
    });
  });

  afterEach(function(done) {
    // Cleanup
    if(socket.connected) {
        console.log('disconnecting...');
        socket.disconnect();
    } else {
        // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
        console.log('no connection to break...');
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
    const aStub = sinon.stub(axios, 'post').resolves(Promise.resolve({ data: {} }));

    platform.core.node({path: '/test/bind/socket.io',
              public: true,
              method: 'get',
              inputs: [ 'test' ],
              controlOutputs: ['done'],
            }, function(i, o, c, _, context) { context.socket.emit('test', i.test); c('done'); });
    
    socket.emit('/test/bind/socket.io', { test: 'testing response' }, 'http://localhost/test');
    socket.on('test', (req) => {
      req.should.equal('testing response')
      done();
    });
  });
});
