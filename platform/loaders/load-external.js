const process = require('child_process');

const registry = require('../core/registry');
const ct = require('../util/color-text');

global.connect_platform_dependencies = global.connect_platform_dependencies || {}

const profile = name => {
  if (!(name in global.connect_platform_dependencies)) global.connect_platform_dependencies[name] = {
    signatures: [],
    aliases: [],
  };
}

const signature = (name, entry) => {
  profile(name);
  global.connect_platform_dependencies[name].signatures.push(entry);
}

const alias = (name, entry) => {
  profile(name);
  global.connect_platform_dependencies[name].aliases.push(entry);
}

module.exports = (info, callback) => {
  const regmarker = entry => signature(info.name, entry.signature);
  const aliasmarker = entry => alias(info.name, entry);
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
