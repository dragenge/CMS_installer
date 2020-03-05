var express = require('express');
var exportedThings = require("./request.js");
var bodyParser = require('body-parser')
var app = express();
//Middleware
const argv = require('yargs').argv

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/public')); // exposes index.html, per below


 app.post('/request', function(req, res) {
    var form = req.body;
    exportedThings.add(form)
    res.send('OK')
 });
app.listen(6400);
