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

  it('add socket', () => {
    sockets.add(FAKE_SOCKET);

    sockets.list.should.include('random');
    sockets.map.should.have.property('random');
    sockets.map.random.should.eql({ socket: FAKE_SOCKET });
  });

  it('add and remove socket', () => {
    sockets.add(FAKE_SOCKET);

    sockets.remove(FAKE_SOCKET);

    sockets.list.should.eql([]);
    sockets.map.should.not.have.property('random');
    sockets.map.should.eql({ });
  });
});