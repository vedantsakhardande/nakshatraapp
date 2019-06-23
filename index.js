const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nakshatraapp:vedantatlas%40123@cluster0-iuvph.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



 app.get('/getschedule/:dateG', function (req, res) {

    let dateG=req.params.dateG;

   if (!dateG) {
       return res.status(400).send({ error: true, message: 'Please provide Date in Gregorian Calender' });
     }

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nakshatraapp");
  var query = { dateG: dateG.toString() };
  var result;
  console.log(query);
  dbo.collection("schedule").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
    db.close();
  });
  });
  });
// Add a new todo
app.post('/addschedule', function (req, res) {

    let nakshatra=req.body.nakshatra;
    let dateG=req.body.dateG;
    let dateM=req.body.dateM;
    let plannedwork = req.body.plannedwork;
    let expense=req.body.expense;
    let income=req.body.income;
    let observations=req.body.observations;
    let temphigh=req.body.temphigh;
    let templow=req.body.templow;
    let humidity=req.body.humidity;
    let note=req.body.note;
    if (!nakshatra && !dateG && !dateM && !plannedwork && !expense && !income && !observations && !temphigh && !templow && !humidity && !note) {
        return res.status(400).send({ error:true, message: 'Please provide task' });
    }


    //var task = req.body.task;
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nakshatraapp");
  var myobj = { nakshatra:nakshatra.toString(), dateG:dateG.toString(), dateM:dateM.toString(),plannedwork : plannedwork.toString(), 
expense:expense.toString(), income:income.toString(), observations:observations.toString(),
temphigh:temphigh.toString(), templow:templow.toString(), humidity:humidity.toString(), note:note.toString() };
  dbo.collection("schedule").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });

});
return res.status(200).send({ error:true, message: 'Successfully Added' });
});

//  Update todo with id
app.put('/updateschedule', function (req, res) {

    let nakshatra=req.body.nakshatra;
    let dateG=req.body.dateG;
    let dateM=req.body.dateM;
    let plannedwork = req.body.plannedwork;
    let expense=req.body.expense;
    let income=req.body.income;
    let observations=req.body.observations;
    let temphigh=req.body.temphigh;
    let templow=req.body.templow;
    let humidity=req.body.humidity;
    let note=req.body.note;
   if (!dateG) {
       return res.status(400).send({ error: true, message: 'Please provide Date in Gregorian Calender' });
     }
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nakshatraapp");
  var myquery = { dateG: dateG.toString() };
  var newvalues = { $set: { nakshatra:nakshatra.toString(), dateG:dateG.toString(), dateM:dateM.toString(),plannedwork : plannedwork.toString(), 
expense:expense.toString(), income:income.toString(), observations:observations.toString(),
temphigh:temphigh.toString(), templow:templow.toString(), humidity:humidity.toString(), note:note.toString() } };
  dbo.collection("schedule").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });

});
    return res.status(200).send({ error: false, message: 'Updated Successfully' });
});

//  Delete todo
app.delete('/deleteschedule',function (req, res) {

    let dateG=req.body.dateG;

    if (!dateG) {
       return res.status(400).send({ error: true, message: 'Please provide Date in Gregorian Calender' });
     }
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nakshatraapp");
  var myquery = { dateG:dateG.toString() };
  dbo.collection("schedule").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
  });

});
    return res.status(200).send({ error: false, message: 'Deleted Successfully' });
});

// all other requests redirect to 404
app.all("*", function (req, res, next) {
    return res.send('page not found');
    next();
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// allows "grunt dev" to create a development server with livereload
module.exports = app;