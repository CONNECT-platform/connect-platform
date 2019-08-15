module.exports.platform = {
  config : {
    nodes: {
      native: ["native/8fact", "native/funs"],
      json: ["fact"],
      module: ["goodbye"],
    },
    aliases: {
      '/ff' : '/fact',
      '/8f' : '/8fact',
    }
  },
}
