const express = require('express');
const path = require('path');
const mongo_conn = require('./mongo_conn');
const api = require('./api');

let app = express();
app.use(express.static(path.join(__dirname, '../client/build')));

mongo_conn.connectToServer();

app.use('/api', api);
app.get('/', (req, res) => {
    res.sendFile('build/index.html', { root: root });
})

const port = process.env.PORT || 3001;

app.listen(port);
