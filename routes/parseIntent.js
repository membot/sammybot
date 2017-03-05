var express = require('express');
var router = express.Router();
var apiai = require('apiai');
var orderStatus = require('./orderStatus');
 
var app = apiai("3cc2f72cdf874994abb8b9ddeb221a4a");

function performRequest(body, success, error){
    var request = app.textRequest(body.content, {
        sessionId: '74e746ed-1f06-4c3b-9e0b-80fff3a93fc6'
    });
 
    request.on('response', function(response) {
        //console.log(response);

        var responsedata = response;
        
        if(response.result && response.result.contexts){
            for (var i=0; i<response.result['contexts'].length; i++){
                if(response.result.contexts[0].name == 'order'){
                    var body = {"membershipNbr" : "4613091860"}
                    orderStatus.performRequest(body, function(data){
                        success(data);
                    })
                }
            }
        } else {
            success(responsedata);
        }
    });
 
    request.on('error', function(error) {
        console.log(error);
    });
 
    request.end();
}

/* POST call */
router.post('/', function(req, res, next) {
    console.log(JSON.stringify(req.body));      
    performRequest(req.body, function(data){
        var responsedata = data;
        if(data.orderSummary != undefined){
            var date = new Date();
            var newDate = new Date(date.setTime( date.getTime() + 7 * 86400000 ));
            responsedata = data.orderSummary[0].orderNo + " is in process of getting shipped. It will arrive by " + newDate;
        }
        res.status(200).json(responsedata);
        console.log(data);
    }, function(error){
        res.status(404).json("Unable to connect to service");
        console.log(error);
    })
});

module.exports = router;
