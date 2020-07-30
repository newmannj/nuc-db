const { MongoClient } = require('mongodb');

require('dotenv').config();
const { DB_NAME, DB_KEY, DB_PORT } = process.env;

let url = `mongodb://${DB_NAME}:${DB_KEY}@${DB_NAME}.mongo.cosmos.azure.com:${DB_PORT}/?ssl=true&appName=@${DB_NAME}@`;
//let local_url = 'mongodb://127.0.0.1:27017/nuc-classrooms';
let _db;

module.exports = {
    connectToServer: () => {
        MongoClient.connect(url, (err, client) => {
            if(err) { console.log(err); }
            else { 
                _db = client.db('nuc-classrooms-db');
            }
        })
    },

    getDb: () => {
        return _db;
    }
}