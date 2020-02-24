var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');

var url = "mongodb://127.0.0.1:27017/nu-classrooms";

const client = new MongoClient(url);

var app = express();
app.use(bodyParser());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(8000, ()=> {
    console.log("Listening on port 8000!");
})


client.connect(function(err, db) {
    if (err) {console.log(err); }
    else { console.log("Connected to database!"); }
})



app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.route('/api/building').get( function(req, res) {
    console.log("endpoint hit");
    const requestedDay = getDayString(req.query.day);
    const requestedBuilding = req.query.building;
    const rtCollection = client.db('nu-classrooms').collection('roomtimes');
    let result = {};
    rtCollection.find({'weekDay':requestedDay}).each(function(err, doc) {
        if(err) { console.log(err); }
        else { 
            if(result[doc.roomKey] == null) {
                result[doc.roomKey].times = [];
            }
            result[doc.roomKey].times.push(doc.)
        }
    })
})


function getDayString(i) {
    let result = "";
    switch(i) {
        case "0":
            result = "Sunday";
            break;
        case "1":
            result = "Monday";
            break;
        case "2":
            result = "Tuesday";
            break;
        case "3":
            result = "Wednesday";
            break;
        case "4":
            result = "Thursday";
            break;
        case "5":
            result = "Friday";
            break;
        case "6":
            result = "Saturday";
            break;
        default:
            result = "fail"
            break;
    }
    return result;
}
