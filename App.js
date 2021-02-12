const express = require('express')
const session = require('express-session');
const methodOverride = require('method-override')
const app = express()
const dateformat = require('dateformat');
const path = require('path')
const ejsMate = require('ejs-mate')
const nodeGeocoder = require('node-geocoder');
const esClient = require('./elasticsearch');


app.engine('ejs',ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'))
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));


const options = {
    provider: 'openstreetmap'
  };
var sess;
const geoCoder = nodeGeocoder(options);


app.get('/',async(req,res)=>{
  res.render('login.ejs')
})


app.get('/home',async(req,res)=>{
    res.render('home')
})


app.post('/home',async(req,res)=>{
  sess = req.session
  sess.name = req.body.name;
  sess.contact = req.body.phone;
  res.redirect('/home')
})

app.post('/admin',async(req,res)=>{
  sess = req.session
  sess.job_poster_id = req.body.id
  res.redirect('/home')
})

app.post('/home/results',async(req,res)=>{
    var l ='';
    sess = req.session
    username = sess.name
    contact = sess.contact
    const {latitude, longitude} = await req.body
    l = l+latitude+","+longitude
    if(Object.keys(req.body).length==3){
      esClient.search({
        index: 'jobs',
        body: {
          "query": {
            "function_score": {
                          "query":{
                                "bool":{
                                      "must": 
                                      [
                                          {
                                              "match":
                                              {
                                                "Gender":"Female"
                                              }
                                          }

                                      ]
                                  }
                              },
                      "functions": 
                          [
                            {
                              "gauss": 
                                {
                                  "coordinates": 
                                  {
                                          "origin": l,
                                          "offset": "0km",
                                          "scale": "1000km",
                                          "decay":0.5
                                  }
                                }
                            }
                          ]
                      }
                  }
  }
}
,async function (error, response,status) {
    if (error)
    {
      console.log("search error: "+error)
    }
    else {
      console.log("--- Response ---");
      console.log("--- Hits ---");
      const jobs = response.hits.hits
      console.log(jobs)
      res.render('Search/find_jobs',{jobs,username,contact})
        }
    })
    }
    else{
      esClient.search({
        index: 'jobs',
        body: {
            "query": {
                "function_score": {
                  "functions": [
                    {
                      "gauss": {
                        "coordinates": {
                          "origin": l,
                          "offset": "0km",
                          "scale": "1000km",
                          "decay":0.5
                        }
                      }
                    }
                  ],
                          "min_score":"0.8"
                }
              }
              }
}
,async function (error, response,status) {
    if (error)
    {
      console.log("search error: "+error)
    }
    else {
      console.log("--- Response ---");
      console.log("--- Hits ---");
      console.log(response)
      const jobs = response.hits.hits
      res.render('Search/find_jobs',{jobs,username,contact})
        }
    })
    } 
})


app.get('/search',async(req,res)=>{
    res.render('Search/search')
})


app.post('/search/results',async(req,res)=>{
    var l = '';
    sess = req.session
    username = sess.name
    contact = sess.contact
    const {title, city, state, country, gender} = req.body.job
    const coordinates = async function(city,state,country){
        var res = await geoCoder.geocode({
        city: city,
        state: state,
        country: country,
        limit:1
      })
      .catch((err)=> {
        console.log(err);
      })
      return res
    };
    const response = await coordinates(city,state,country)
    const {latitude, longitude} = response[0];
    sess.lat = response[0].latitude
    sess.lon = response[0].longitude
    l = l+latitude+","+longitude
    await esClient.search({
        index: 'jobs',
        body: {
            "query": {
              "function_score": {
                            "query":{
                                  "bool":{
                                        "must": 
                                        [
                                            {
                                                "match": 
                                                {
                                                  "Job_Title" : title
                                                }
                                                
                                            },
                                            {
                                                "match":
                                                {
                                                  "Gender":gender
                                                }
                                            }

                                        ]
                                    }
                                },
                        "functions": 
                            [
                              {
                                "gauss": 
                                  {
                                    "coordinates": 
                                    {
                                            "origin": l,
                                            "offset": "50km",
                                            "scale": "1500km"
                                    }
                                  }
                              }
                            ]
                        }
                    }
                }
            },
async function (error, response,status) {
    if (error){
      console.log("search error: "+error)
    }
    else {
      console.log("--- Response ---");
      console.log("--- Hits ---");
      const jobs = response.hits.hits
      console.log("I am Search results",jobs)
      if(jobs.length !=0 ){
        for(let job of jobs) {
          await esClient.index({  
            index: 'results',
            id: job._id,
            body: job._source
          },async function(err,resp,status) {
              console.log(resp);
          });
        }
      }
      res.render('Search/search_results',{jobs,username,contact})
}
    })

})


app.get('/postjobnew',async(req,res)=>{
    res.render('PostJob/post_job')
})


app.post('/postjob',async (req,res)=>{
const datetime = new Date();
const newdate = dateformat(datetime,'fullDate')
console.log(datetime)
const coordinates = async function(city,state,country){
    var res = await geoCoder.geocode({
    city: city,
    state: state,
    country: country,
    limit:1
  })
  .catch((err)=> {
    console.log(err);
  })
  return res
};
const{id,title,city,state,country,phone,gender,salary,email,salary_type} = req.body.job
const response = await coordinates(city,state,country)

const {latitude, longitude} = response[0];
await esClient.index({  
    index: 'jobs',
    body: {
      "UserId": id,
      "Job_Title": title,
      "City": city,
      "State": state,
      "Country": country,
      "coordinates":{
          "lat":latitude,
          "lon":longitude
      },
      "Phone":phone,
      "Gender": gender,
      "Salary": salary,
      "Email":email,
      "Salary_Type": salary_type,
      "Date": newdate
    }
  },async function(err,resp,status) {
      console.log(resp);
      res.redirect(`/postjob/${resp._id}`)
  });
})


app.get('/postjob/:id',async(req,res)=>{
    body = {}
    const id = req.params.id
    await esClient.get({
      index: 'jobs',
      id: id
    }, function (error, response) {
    body = response._source
    res.render('PostJob/showpostedjob',{body})
    });
})




app.get('/showPostings',async(req,res)=>{
  sess = req.session
  username = sess.name
  contact = sess.contact
  poster_id = sess.job_poster_id
  await esClient.search({
    index:"jobs",
    body:{
      "query":{
        "match":{
          "UserId":poster_id
        }
      }
    }
  },
  async function (error, response,status) {
    if (error){
      console.log("search error: "+error)
    }
    else {
      console.log("--- Response ---");
      console.log("--- Hits ---");
      const jobs = response.hits.hits
      res.render('PostJob/showYourPostedJobs',{jobs,username,contact})
}
    })

})


app.delete('/postjob/:id',async(req,res)=>{
  const {id} = req.params
  esClient.delete({
    index: 'jobs',
    id: id
}, function (error, response) {
    console.log(response);
});
res.redirect('/home')
})

app.listen(3000, ()=>{
    console.log("Serving on port 3000")
})