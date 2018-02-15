class InputMissing extends Error {
  constructor(missing, given) {
    super(`input ${missing} is missing from {${Object.keys(given)}}`);
  }
}

class UnregisteredPath extends Error {
  constructor(path) {
    super(`${path} is not registered with registry.`);
  }
}

module.exports = {
  InputMissing: InputMissing,
  UnregisteredPath: UnregisteredPath,
}
