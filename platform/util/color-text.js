

const bg = {
  black : "\x1b[40m",
  red : "\x1b[41m",
  green : "\x1b[42m",
  yellow : "\x1b[43m",
  blue : "\x1b[44m",
  magenta : "\x1b[45m",
  cyan : "\x1b[46m",
  white : "\x1b[47m",
}

const reset = "\x1b[0m";

module.exports = (color, text) => {
  return color + text + reset;
}

module.exports.reset = reset;
module.exports.bright = "\x1b[1m";
module.exports.dim = "\x1b[2m";
module.exports.underscore = "\x1b[4m";
module.exports.blink = "\x1b[5m";
module.exports.reverse = "\x1b[7m";
module.exports.hidden = "\x1b[8m";

module.exports.black = "\x1b[30m";
module.exports.red = "\x1b[31m";
module.exports.green = "\x1b[32m";
module.exports.yellow = "\x1b[33m";
module.exports.blue = "\x1b[34m";
module.exports.magenta = "\x1b[35m";
module.exports.cyan = "\x1b[36m";
module.exports.white = "\x1b[37m";

module.exports.bg = bg;
