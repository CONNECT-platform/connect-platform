const process = require('child_process');

const registry = require('../core/registry');
const ct = require('../util/color-text');

dependencies = {}

const markdep = (name, path) => {
  if (!(name in dependencies)) dependencies[name] = [];
  dependencies[name].push(path);
}

module.exports = (info, callback) => {
  const regmarker = entry => markdep(info.name, entry.signature.path);
  const aliasmarker = entry => markdep(info.name, entry.alias);
  const unsubscribe = () => {
    registry.unsubscribe(registry.events.registered, regmarker);
    registry.unsubscribe(registry.events.aliased, aliasmarker);
  }

  const load = () => {
    registry.subscribe(registry.events.registered, regmarker);
    registry.subscribe(registry.events.aliased, aliasmarker);

    let mod = require(info.name);
    callback(mod, info.name, unsubscribe);
  }

  try {
    load();
  } catch(_) {
    unsubscribe();

    console.log(ct(ct.blue + ct.bright, 'EXTERNAL PACKAGE MISSING::') +
          ` attempting to install ${ct(ct.underscore, info.name)} via ${ct(ct.dim + ct.underscore, info.source)}`);
    process.exec(`npm install ${info.source}`, error => {
      if (error) {
        console.log(ct(ct.red + ct.bright, `ERROR:: could not install ${info.name}: `) + error);
      }
      else {
        try {
          load();
          console.log(ct(ct.blue + ct.bright, 'EXTERNAL PACKAGE INSTALLED::') + ct(ct.underscore, info.name));
        } catch(error) {
          console.log(ct(ct.red + ct.bright, `ERROR:: could not install ${info.name}`));
        }
      }
    });
  }
}

module.exports.dependencies = dependencies;
