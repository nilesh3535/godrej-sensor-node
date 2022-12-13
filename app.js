const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const jsdom = require('jsdom')
const moment=require('moment');
const { isValidObjectId } = require("mongoose");
const app = express();
const  ObjectID = require('mongodb').ObjectId;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));


var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://godrej:godrej2022@cluster0.b9pgodh.mongodb.net/?retryWrites=true&w=majority";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("GodrejDB");
  dbo.collection("Sensordata").find({}, {}).toArray(function(err, result) {
    if (err) throw err;
   // console.log(result);
    db.close();
  });
});

//getToday

function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

app.get("/", function (req, res) {
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("GodrejDB");
    today = getToday();
    dbo.collection("Sensordata").find({Date: today.toString()}, {}).sort({$natural:-1}).toArray(function(err, result) {
      if (err) throw err; 
      //console.log(result.id);
      res.render("summary-report", {
        allReports: result, 
        title:  'Today\'s Reports',
      });
  
      db.close();
    });
  });
    // console.log(reports);
});

//all reports
app.get("/all-reports", function (req, res) {
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("GodrejDB");
   
    dbo.collection("Sensordata").find({}, {}).sort({$natural:-1}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result.id);
      res.render("summary-report", {
        allReports: result, 
        title:  'All Reports',
      });
  
      db.close();
    });
  });
    // console.log(reports);
});

//summary-between-dates
app.post("/summary-between-dates", function (req, res) {
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("GodrejDB");
    const _startDate = req.body.idate1;
    const _endDate = req.body.idate2;
    dbo.collection("Sensordata").find({Date: {$gte: _startDate, $lte: _endDate}}, {}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result.id);
      res.render("summary-report", {
        allReports: result, 
        title:  'Reports between ' + _startDate + ' to ' + _endDate,
      });
  
      db.close();
    });
  });
    // console.log(reports);
});
//search by Topic name
app.post("/search-report", function (req, res) {
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err; 
    var dbo = db.db("GodrejDB");
    today = getToday();
    const _search = req.body.tname;
    dbo.collection("Sensordata").find({Topic: _search.toString()}, {}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result.id);
      res.render("summary-report", {
        allReports: result, 
        title:  'Found Result for Topic ='+_search,
      });
  
      db.close();
    });
  });
    // console.log(reports);
});

//Detail report for ID
app.get("/detailed-report/:id", function (req, res) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("GodrejDB");
    const _id = req.params.id;
    console.log(_id)
    dbo.collection("Sensordata").find({_id :new ObjectID(_id.toString())}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      res.render("detailed-report", {
        allReports: result, 
        title:  'DETAILED REPORT  #id:  '+_id,
      });
  
      db.close();
    });
  });
    
});

//show graph
app.get("/graph-reports", function (req, res) {
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("GodrejDB");
    today = getToday();
    //today="2022-11-30"
    dbo.collection("Sensordata").find({Date: today.toString()}, {}).limit(10).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result.id);
      res.render("graph-report", {
        allReports: result, 
        titleGraph:'Today\'s Graph Report',
        titledate:"("+today.toString()+")",
      });
  
      db.close();
    });
  });
    // console.log(reports);
});

//graph-between-dates
app.post("/graph-between-dates", function (req, res) {
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("GodrejDB");
    const _startDate = req.body.gdate1;
    const _endDate = req.body.gdate2;
    dbo.collection("Sensordata").find({Date: {$gte: _startDate, $lte: _endDate}}, {}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result.id);
      res.render("graph-report", {
        allReports: result, 
        titleGraph:  'Graph Report between ' + _startDate + ' to ' + _endDate,
        titledate:'',
      });
  
      db.close();
    });
  });
    // console.log(reports);
});

app.listen(process.env.PORT || 3000, () => console.log("___Server has started sucessfully on 3000."));
