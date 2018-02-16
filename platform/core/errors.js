class InputMissing extends Error {
  constructor(missing, given) {
    super(`input ${missing} is missing from {${Object.keys(given)}}`);
    this.status = 400;
  }
}

class UnregisteredPath extends Error {
  constructor(path) {
    super(`${path} is not registered with registry.`);
    this.status = 404;
  }
}

module.exports = {
  InputMissing: InputMissing,
  UnregisteredPath: UnregisteredPath,
}
