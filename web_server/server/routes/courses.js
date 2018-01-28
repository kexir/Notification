var express = require('express');
var rpc_client = require('../rpc_client/rpc_client');
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

/* GET courses list. */
router.get('/', function(req, res, next) {
    console.log('Fetching courses...');
    rpc_client.getCourses( function(response) {
        console.log(response);
        res.json(response);
    });
});


module.exports = router;
