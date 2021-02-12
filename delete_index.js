const esClient = require('./elasticsearch');

esClient.indices.delete({index: 'jobs'},function(err,resp,status) {  
    console.log("delete",resp);
  });