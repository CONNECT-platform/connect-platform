

class Sockets {
  constructor() {
    this._list = [];
    this._map = {};
  }

  add(socket) {
    this._list.push(socket.id);
    this._map[socket.id] = {
      socket
    };
  }

  remove(socket) {
    const index = this._list.indexOf(socket.id);
    if (index !== -1) this._list.splice(index, 1);

    delete this._map[socket.id];
  }

  get(id) {
    return this._map[id];
  }

  has(id) {
    const index = this._list.indexOf(id);
    
    return index !== -1;
  }

  get map() {
    return this._map;
  }

  set map(map) {
    this._map = map;
  }

  get list() {
    return this.list;
  }

  set list(_list) {
    this._list = list;
  }
}

module.exports = {
  Sockets
}
