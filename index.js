const express = require('express');
const bodyParser = require("body-parser");
const app = express()
const RegistrationController = require('./controller/RegistrationController');

let registrationController = new RegistrationController();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded( {extended: true} ));

app.listen(8000, () => console.log('Star Registry servic listening on port 8000!'))
app.get('/', (req, res) => res.send('Star Registry servic!'))


app.post("/requestValidation", (req, res) => registrationController.requestValidationAddress(req, res));

app.post("/message-signature/validate", (req, res) => registrationController.validateMessageSignature(req, res));

app.post("/block", (req, res) => registrationController.registerStar(req, res));

app.get("/stars/address:address", (req, res) => registrationController.findStarByAddress(req, res));

app.get("/stars/hash:hash", (req, res) => registrationController.findStarByHash(req, res));

app.get("/block/:height", (req, res) => registrationController.findStarByBlockHeight(req, res));
