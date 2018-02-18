const path = require('path');
const ct = require('../util/color-text');


module.exports = (originalPath, config) => {
  let searchPaths = [];

  try {
    return require(originalPath);
  } catch(_) { searchPaths.push(originalPath); }

  if (config.root) {
    try {
    return require(path.join(config.root, originalPath));
    } catch(_){ searchPaths.push(path.join(config.root, originalPath)); }
  }

  console.log(ct(ct.yellow + ct.bright, 'WARNING:: ') +
          `couldn't load node ${ct(ct.cyan, originalPath)}, searched in`+
          `${ct(ct.bg.cyan + ct.cyan + ct.bright, '\n\t' + searchPaths.join('\n\t'))}\n`
             );
}
