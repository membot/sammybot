var express = require('express');
var router = express.Router();
var http = require('http');

var host = 'ultra-esb.qa.esb.platform.qa.walmart.com';
var path = '/service/sams-order-services/v1/orderlookup/orderhistory';
var qs = '?profileId='; //documentSentiment,entities,language,sentences,tokens';

function performRequest(body, success, error){
    //call order api & parse response
    var payload = {};

    endpoint = path + qs + body.membershipNbr;

    headers = {
        'WM_CONSUMER.ID':'8d8dcfee-85b5-42e9-bb04-e86e6c1a8fee',
        'WM_QOS.CORRELATION_ID':'100',
        'WM_SVC.ENV':'qa',
        'WM_SVC.NAME':'sams-order-services',
        'WM_SVC.VERSION':'1.0.0',
        'Content-Type': 'application/json'
        //'Content-Length': JSON.stringify(payload).length
    };

    var options = {
        host: host,
        path: endpoint,
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function(res) {
        var responseString = '';
        var responseObject = {
            orderSummary : []
        };

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log(responseString);

            var orderArray = JSON.parse(responseString).payload.orderSummary ;

            if(orderArray != undefined){
                for(var i in orderArray){
                    console.log(orderArray[i].orderNo);

                    if(orderArray[i].orderState == 'OSHIPPING'){
                        responseObject.orderSummary.push({
                            "orderNo" : orderArray[i].orderNo
                        });
                    }       
                }
            }
              
            //var responseObject = JSON.parse(responseString);
            //success(responseObject);
            success(responseObject);
        });
    });

    req.write(JSON.stringify(payload));
    req.end();
}

/* POST call */
router.post('/', function(req, res, next) {
    console.log(JSON.stringify(req.body));      
    performRequest(req.body, function(data){
        res.status(200).json(data);
        console.log(data);
    }, function(error){
        res.status(404).json("Unable to connect to service");
        console.log(error);
    })
});

exports.router = router;
exports.performRequest = performRequest;
