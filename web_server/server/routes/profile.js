var express = require('express');
var rpc_client = require('../rpc_client/rpc_client');
var router = express.Router();

/* GET profile */
router.get('/profile', function(req, res, next) {
    console.log('GET profile...');
    rpc_client.getProfile(1, function(response) {
        res.json(response);
    });
});

/* POST profile */
router.post('/profile', function(req,res, next) {
    console.log('POST profile...');
    rpc_client.changeProfile(1, function (response) {
        res.json(response);
    });
});

module.exports = router;

