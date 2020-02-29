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

/*
client.connect(function(err, db) {
    if (err) {console.log(err); }
    else { console.log("Connected to database!"); }
})
*/


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.route('/', function(res,req) {
    res.send("Hello World");
})

app.route('/api/building').get( function(req, res) {
    const requestedDay = getDayString(req.query.day);
    const requestedBuilding = req.query.building;
    const rtCollection = client.db('nu-classrooms').collection('roomtimes');
    rtCollection.find({'weekDay':requestedDay, 'building':{$regex : requestedBuilding}}).toArray(function(err, items) {
        if(err) { console.log(err); }
        else {
            let result = {};
            for(doc_idx in items) {
                let doc = items[doc_idx];
                if(result[doc.roomKey] == undefined) {
                    result[doc.roomKey] = {};
                    result[doc.roomKey].times = [];
                    result[doc.roomKey].building = doc.building;
                    result[doc.roomKey].room = doc.roomKey.substring(4);
                }
                let timePair = {};
                timePair.startTime = doc.startTime;
                timePair.endTime = doc.endTime;
                if(!timeAlreadyExists(result[doc.roomKey].times, timePair)) {
                    result[doc.roomKey].times.push(timePair);
                }
            }
            res.send(result);
        }
    })
})

/**
 * Returns whether the provided timePair already exists in the list.
 * @param {*} timeList list to check
 * @param {*} timePair time pair to check
 */
function timeAlreadyExists(timeList, timePair) {
    for(time in timeList) {
        if(timeList[time].startTime === timePair.startTime) {
            return true;
        }
    }
    return false;
};


/**
 * Returns the day string for the int that is passed in. 
 * 0 is Sunday, 6 is Saturday.
 * @param {} i Integer representation of week day.
 */
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
