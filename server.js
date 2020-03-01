var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');

var url = "mongodb://127.0.0.1:27017/nu-classrooms";

const client = new MongoClient(url);

var app = express();
app.use(bodyParser());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));

/**
 * For some reason nginx doesn't like port 8000??
 */
app.listen(3000, ()=> {
    console.log("Listening on port 3000!");
})

/**
 * Connect to database.
 */
client.connect(function(err, db) {
    if (err) {console.log(err); }
    else { console.log("Connected to database!"); }
})

app.route('/api/classrooms').get( function(req, res) {
    const requestedDay = getDayString(req.query.day);
    const rtCollection = client.db('nu-classrooms').collection('roomtimes');
    rtCollection.find({'weekDay':requestedDay}).toArray(function(err, items){
        if(err) {console.log(err)}
        else {
            let result = {};
            for(doc_idx in items) {
                result = collectResults(result, items[doc_idx]);
            }
            res.send(result);
        }
    })
})

/**
 * API route for getting current rooms from a building on a specific day.
 */
app.route('/api/building').get( function(req, res) {
    const requestedDay = getDayString(req.query.day);
    const requestedBuilding = req.query.building;
    const rtCollection = client.db('nu-classrooms').collection('roomtimes');
    rtCollection.find({'weekDay':requestedDay, 'building':{$regex : requestedBuilding}}).toArray(function(err, items) {
        if(err) { console.log(err); }
        else {
            let result = {};
            for(doc_idx in items) {
                result = collectResults(result, items[doc_idx]);
            }
            res.send(result);
        }
    })
})

/**
 * Handles adding doc correctly to the result map. If the class in doc is present,
 * it will append to the times list. Otherwise, it will create a new entry.
 * 
 * @param {*} resultMap map to append to
 * @param {*} doc doc to check.
 */
function collectResults(resultMap, doc) {
    if(!(doc.building == "none")) {
        if(resultMap[doc.roomKey] == undefined) {
            resultMap[doc.roomKey] = {};
            resultMap[doc.roomKey].times = [];
            resultMap[doc.roomKey].building = doc.building;
            resultMap[doc.roomKey].room = doc.roomKey.substring(4);
        }
        let timePair = {};
        timePair.startTime = doc.startTime;
        timePair.endTime = doc.endTime;
        if(!timeAlreadyExists(resultMap[doc.roomKey].times, timePair)) {
            resultMap[doc.roomKey].times.push(timePair);
        }

    }
    return resultMap;
}

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
