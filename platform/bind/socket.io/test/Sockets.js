const chai = require('chai');
const { Sockets } = require('../Sockets');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Sockets', () => {
  let sockets = null;
  const FAKE_SOCKET = { id: 'random', fake: true };

  beforeEach(() => {
    sockets = new Sockets();
  });

  afterEach(() => {
    delete sockets;
  })

  describe('add()', () => {
    it('should add socket', () => {
      sockets.add(FAKE_SOCKET);

      sockets._list.should.include('random');
      sockets._map.should.have.property('random');
      sockets._map.random.should.eql({ socket: FAKE_SOCKET });
    });
  });

  describe('has()', () => {
    it('should return if socket exists', () => {
      sockets.add(FAKE_SOCKET);

      sockets.has(FAKE_SOCKET.id).should.be.true;
    });
  });

  describe('get()', () => {
    it('should get socket by id', () => {
      sockets.add(FAKE_SOCKET);

      sockets.get(FAKE_SOCKET.id).should.eql({ socket: FAKE_SOCKET });
    });
  });

  describe('remove()', () => {
    it('remove socket', () => {
      sockets.add(FAKE_SOCKET);

      sockets.remove(FAKE_SOCKET);

      sockets._list.should.eql([]);
      sockets._map.should.not.have.property('random');
      sockets._map.should.eql({ });
    });
  });
});