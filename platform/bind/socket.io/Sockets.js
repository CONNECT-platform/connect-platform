

class Sockets {
  constructor() {
    this.list = [];
    this.map = {};
  }

  add(socket) {
    this.list.push(socket.id);
    this.map[socket.id] = {
      socket
    };
  }

  remove(socket) {
    const index = this.list.indexOf(socket.id);
    if (index !== -1) this.list.splice(index, 1);

    delete this.map[socket.id];
  }
}

module.exports = {
  Sockets
}
