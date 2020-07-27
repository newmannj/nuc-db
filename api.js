const express = require('express');
let router = express.Router();
const mongo_conn = require('./mongo_conn');
const Utils = require('./utils');

/**
 * Route for querying all classrooms.
 * @param day: number representing day for query.
 */
router.get('/classrooms', (req, res) => {
    const requestedDay = Utils.getDayString(req.query.day);
    const classroomColl = mongo_conn.getDb().collection('classrooms');
    classroomColl.find({}).toArray((err, items) => {
        if(err) { console.log(err); }
        else { res.send(Utils.collectGetResults(items, requestedDay)); }
    })
})

/**
 * Route for querying a specific building.
 * @param day: number representing day for query.
 * @param building: building string to search with.
 */
router.get('/building', (req, res) => {
    const requestedDay = Utils.getDayString(req.query.day);
    const requestedBuilding = req.query.building;
    const classroomColl = mongo_conn.getDb().collection('classrooms');
    /** TODO: This might not be the best way to do searches. */
    classroomColl.find({'building': new RegExp(requestedBuilding, 'i')})
    .toArray((err, items) => {
        if(err) { console.log(err); }
        else {
            let result = Utils.collectGetResults(items, requestedDay);
            if(result['roomCount'] == 0) {
                result['query'] = requestedBuilding;
                res.status(404).send(result);
            } else {
                res.status(200).send(result);
            }
        }
    })
})

module.exports = router;