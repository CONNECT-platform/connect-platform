const path = require('path');
const ct = require('../util/color-text');


module.exports = (originalPath, searchPaths, callback) => {
  let searchedPaths = [];

  if (searchPaths.indexOf('') == -1)
    searchPaths = [''].concat(searchPaths);

  if (searchPaths) {
    for (let searchPath of searchPaths) {
      let _path = path.join(searchPath, originalPath);
      try {
        let loaded = require(_path);
        if (callback) callback(loaded, _path);
        return loaded;
      } catch(_){ searchedPaths.push(_path); }
    }
  }

  console.log(ct(ct.yellow + ct.bright, 'WARNING:: ') +
          `couldn't load node ${ct(ct.cyan, originalPath)}, searched in`+
          `${ct(ct.bg.cyan + ct.cyan + ct.bright, '\n\t' + searchedPaths.join('\n\t'))}\n`
             );
}
