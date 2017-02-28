var express = require('express');
var router = express.Router();
var apiai = require('apiai');
 
var app = apiai("3cc2f72cdf874994abb8b9ddeb221a4a");

function performRequest(body, success, error){
    var request = app.textRequest(body.content, {
        sessionId: '74e746ed-1f06-4c3b-9e0b-80fff3a93fc6'
    });
 
    request.on('response', function(response) {
        //console.log(response);
        success(response);
    });
 
    request.on('error', function(error) {
        console.log(error);
    });
 
    request.end();
}

/* POST call */
router.post('/', function(req, res, next) {
      
    performRequest(req.body, function(data){
        res.status(200).json(data);
        console.log(data);
    }, function(error){
        res.status(404).json("Unable to connect to service");
        console.log(error);
    })
});

module.exports = router;