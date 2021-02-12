const esClient = require('./elasticsearch');
esClient.indices.create({  
    index: 'jobs'
  },function(err,resp,status) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("create",resp);
    }
  });



