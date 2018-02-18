class PinConnectionError extends Error {
  constructor(reason, pin1, pin2) {
    super(`cannot connect ${pin1} to ${pin2}: ${reason}`);

    this.reason = reason;
    this.pin1 = pin1;
    this.pin2 = pin2;
  }
}

class IncompatiblePins extends PinConnectionError {
  constructor(pin1, pin2) {
    super(`${typeof(pin1)} and ${typeof(pin2)} aren't compatible.`, pin1, pin2);
  }
}

class WrongNodeOutput extends Error {
  constructor(node, output) {
    super(`${output} is not acceptable for node with signature ${JSON.stringify(node.signature)}.'`);
  }
}

module.exports = {
  PinConnectionError: PinConnectionError,
  IncompatiblePins: IncompatiblePins,

  WrongNodeOutput: WrongNodeOutput,
}
