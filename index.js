const express = require('express');
const bodyParser = require("body-parser");
const app = express()
const BlockController = require('./BlockController');


let blockController = new BlockController();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded( {extended: true} ));

app.listen(8000, () => console.log('RESTful Web API listening on port 8000!'))

app.get('/', (req, res) => res.send('RESTful Web API!'))
app.get("/block/:num", (req, res) =>blockController.getBlock(req, res));
app.post("/block", (req, res) => blockController.addBlock(req, res));

