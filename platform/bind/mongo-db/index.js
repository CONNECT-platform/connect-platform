module.exports.platform = {
  config : {
    nodes : {
      native : [
        'insert',
        'update',
        'get',
        'delete',
        'search/search',
        'search/resolve',
        'search/filter',
        'search/sort',
        'search/limit',
        'search/offset',
      ]
    },
    aliases: {
      '/db/insert': '/firestore/insert',
      '/db/update': '/firestore/update',
      '/db/get': '/firestore/get',
      '/db/delete': '/firestore/delete',

      '/db/search': '/firestore/search',
      '/db/search/resolve': '/firestore/search/resolve',
      '/db/search/filter': '/firestore/search/filter',
      '/db/search/sort': '/firestore/search/sort',
      '/db/search/limit': '/firestore/search/limit',
      '/db/search/offset': '/firestore/search/offset',
    }
  }
}
