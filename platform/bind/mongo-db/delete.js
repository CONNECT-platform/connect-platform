const platform = require('../../');
const db = require('./database');
let {ObjectId} = require('mongodb');


platform.core.node({
  path: '/mongo-db/delete',
  public: false,
  inputs: ['collection', 'id'],
  outputs: [],
  controlOutputs: ['done', 'no_connection', 'not_found'],
}, (inputs, output, control) => {
  if (db.connected) {
    db.instance
      .collection(inputs.collection)
      .deleteOne({_id: ObjectId(inputs.id)})
      .then(({result: deletion}) => {
        if(deletion.ok){
          if(deletion.n > 0){
            control('done');
          } else {
            control('not_found');
          }
        } else {
          control('no_connection')
        }
      });
  }
  else control('no_connection');
});
