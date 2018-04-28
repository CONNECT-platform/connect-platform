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
      '/db/insert': '/mongo-db/insert',
      '/db/update': '/mongo-db/update',
      '/db/get': '/mongo-db/get',
      '/db/delete': '/mongo-db/delete',

      '/db/search': '/mongo-db/search',
      '/db/search/resolve': '/mongo-db/search/resolve',
      '/db/search/filter': '/mongo-db/search/filter',
      '/db/search/sort': '/mongo-db/search/sort',
      '/db/search/limit': '/mongo-db/search/limit',
      '/db/search/offset': '/mongo-db/search/offset',
    }
  }
}
