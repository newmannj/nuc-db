const express = require('express');
let router = express.Router();
const mongo_conn = require('./mongo_conn');
const Utils = require('./utils');

router.get('/classrooms', (req, res) => {
    const requestedDay = Utils.getDayString(req.query.day);
    const classroomColl = mongo_conn.getDb().collection('classrooms');
    classroomColl.find({}).toArray((err, items) => {
        if(err) { console.log(err); }
        else {
            res.send(Utils.collectGetResults(items, requestedDay));
        }
    })
})

router.get('/building', (req, res) => {
    const requestedDay = Utils.getDayString(req.query.day);
    const requestedBuilding = req.query.building;
    const classroomColl = mongo_conn.getDb().collection('classrooms');
    classroomColl.find({'building': new RegExp(requestedBuilding, 'i')})
    .toArray((err, items) => {
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
                } else {
                    const key = items[doc_idx]._id;
                    result[key] = {};
                    result[key].times = [];
                    result[key].building = items[doc_idx]['building'];
                    result[key].room = items[doc_idx]['room'];
                }
            }
            res.send(result);
        }
    })
})

module.exports = router;