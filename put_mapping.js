const esClient = require('./elasticsearch');
esClient.indices.putMapping({
    index: 'jobs',
    body: {
        
        properties: {
        Job_Title:{
            type: "text"
        },
      City: {
        type: "text"
      },
      State : {
          type:"text"
      },
      Country: {
          type:"text"
      },
      Gender:{
        type: "text"
      },
      Salary:{
        type: "float"
      },
      Date:{
        type:"text"
      },
        coordinates: {
              type:"geo_point"
          }
        },
      }
    }
  ,function(err,resp,status) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("create",resp);
    }
  });
