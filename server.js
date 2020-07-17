var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');

var url = "mongodb://127.0.0.1:27017/nuc-classrooms";

const client = new MongoClient(url);

var app = express();
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/**
 * For some reason nginx doesn't like port 8000??
 */
app.listen(8000, ()=> {
    console.log("Listening on port 8000!");
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
    const rtCollection = client.db('nuc-classrooms').collection('classrooms');
    rtCollection.find({}).toArray((err, items) => {
        if(err) {console.log(err)}
        else {
            let result = {};
            for(doc_idx in items) {
                if(items[doc_idx][requestedDay]) {
                    const key = items[doc_idx]._id;
                    result[key] = {};
                    result[key].times = items[doc_idx][requestedDay];
                    result[key].building = items[doc_idx]['building'];
                    result[key].room = items[doc_idx]['room'];
                }
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
    
    const rtCollection = client.db('nuc-classrooms').collection('classrooms');
    rtCollection.find({'building': new RegExp(requestedBuilding, 'i')}).toArray(function(err, items) {
        if(err) { console.log(err); }
        else {
            let result = {};
            for(doc_idx in items) {
                if(items[doc_idx][requestedDay]) {
                    const key = items[doc_idx]._id;
                    result[key] = {};
                    result[key].times = items[doc_idx][requestedDay];
                    result[key].building = items[doc_idx]['building'];
                    result[key].room = items[doc_idx]['room'];
                }
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
            result = "sunday";
            break;
        case "1":
            result = "monday";
            break;
        case "2":
            result = "tuesday";
            break;
        case "3":
            result = "wednesday";
            break;
        case "4":
            result = "thursday";
            break;
        case "5":
            result = "friday";
            break;
        case "6":
            result = "saturday";
            break;
        default:
            result = "fail"
            break;
    }
    return result;
}
