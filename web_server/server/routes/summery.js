/**
 * Created by lyuqi on 5/4/17.
 */
var express = require('express');
var rpc_client = require('../rpc_client/rpc_client');
var router = express.Router();
let londonTempData = {
    dataPoints: [
        {
            time: 1130,
            temperature: 12
        },
        {
            time: 1200,
            temperature: 13
        },
        {
            time: 1230,
            temperature: 15
        },
        {
            time: 1300,
            temperature: 14
        },
        {
            time: 1330,
            temperature: 15
        },
        {
            time: 1406,
            temperature: 12
        },
    ]
};
router.get('/summery', function(req, res) {
    console.log('Fetching summery...');
    res.send(londonTempData);
});

router.post('/summery', function(req,res){
    console.log('add summery...');
    let temp = parseInt(req.body.temperature);
    let time = parseInt(req.body.time);
    if(temp && time && !isNaN(temp) && !isNaN(time)){
        let newDataPoint = {
            temperature: temp,
            time: time
        };
        londonTempData.dataPoints.push(newDataPoint);
        pusher.trigger('london-temp-chart', 'new-temperature', {
            dataPoint: newDataPoint
        });
        res.send({success:true});
    }else{
        res.send({success:false, errorMessage: 'Invalid Query Paramaters, required - temperature & time.'});
    }
});

module.exports = router;