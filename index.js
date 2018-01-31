var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const UberRUSH = require('uber-rush');
var PORT = process.env.PORT || 8080;


//setup uber-rush client with client_secret, client_id
const UberRUSHClient = UberRUSH.createClient({
    client_secret: 'tpfmHr20Q2PNYsYyghHsl5x-eHRKDm2NCJXf8EY-',
    client_id: 'x12ZWFymkcThH2NkgkPxWQt3Sv4mPpNk',
    sandbox: true,
    simulate : false
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//get all quotes for a location 
// post request with the payload : 
// {
// 	"item": {
// 		"title": "Pizza Delivery",
// 		"quantity": "1",
// 		"is_fragile": "true"
// 	},
// 	"pickup": {
// 		"contact": {
// 			"first_name": "Phani",
// 			"last_name": "Turlapati",
// 			"phone": {
// 				"number": "+12356981236"
// 			}
// 		},
// 		"location": {
// 			"address": "1900 Oracle Way",
// 			"city": "Reston",
// 			"state": "VA",
// 			"postal_code": "20190",
// 			"country": "US"
// 		}
// 	},
// 	"dropoff": {
// 		"contact": {
// 			"first_name": "Oracle PPL",
// 			"last_name": "PPs",
// 			"phone": {
// 				"number": "+15896541236"
// 			}
// 		},
// 		"location": {
// 			"address": "1910 Oracle Way",
// 			"city": "Reson",
// 			"state": "VA",
// 			"postal_code": "20190",
// 			"country": "US"
// 		}
// 	}
// }

app.post('/api/getAQ', function(request, response) {

    var uber_delivery = request.body;
    console.log(uber_delivery);
    var delivery = UberRUSHClient.createDelivery(uber_delivery);
var allQs = '';
delivery.quote()
.then(function(quotes) {
    console.log('Received ' + quotes.length + ' quotes:');
	for (var i = 0; i < quotes.length; i++) {
        console.log(quotes[i]);
    }
    
    response.json(JSON.stringify(quotes));
});
});


//post with best quote to the uber rush
app.get('/api/confirmQ/:q_id', function(request, response) {
    console.log('<<Confirm Delivery>>')
    var q_id = request.params.q_id; 
    //var q_id = request.body.quote; 
    console.log("Quote ID "+q_id);
    delivery.confirm({quote_id: q_id}).then(function(deliveries){
        
        var json_response = '{deliver_id : '+deliveries.delivery_id +
        ',delivery_eta : '+deliveries.dropoff.eta +
        ',pickup_eta : '+deliveries.pickup.eta +
        ',fee : '+deliveries.fee +
        '}';
        console.log("Delivery ID "+deliveries.delivery_id);
        console.log("Delivery ETA :" +deliveries.dropoff);
        console.log("Pickup ETA :" +deliveries.pickup);
        console.log("Pickup Fee :" +deliveries.fee);
        response.json(json_response);
    });
    
    //response.json(delivery.delivery_id);
});

//get status of the delivery
app.get('/api/getStatus', function(request, response) {
    const d_id = request.params.d_id; 
    delivery.updateDeliveryInfo().then(function(status){
        console.log(delivery.status);
        response.json(delivery.status);
    });
});

//manully update the status for the delivery
app.get('/api/updateStatus/:status', function(request, response) {
    var status = request.params.status; 
    console.log(status);
    delivery.updateStatus(status);
});



 
  app.listen(PORT, function(err) {
	if(err) {
		console.log("Unable to launch app on the port" + PORT, err);
	}

	console.log("Running App on port" + PORT);
})

