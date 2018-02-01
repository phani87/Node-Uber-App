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
    simulate: false
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var uber_delivery = "";

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

app.post('/api/getAQ', function (request, response) {
    uber_delivery = request.body;
    var delivery = UberRUSHClient.createDelivery(uber_delivery);
    var allQs = '';
    delivery.quote()
        .then(function (quotes) {
            console.log('Received ' + quotes.length + ' quotes:');
            for (var i = 0; i < quotes.length; i++) {
                console.log(quotes[i]);
            }

            response.json(JSON.stringify(quotes));
        });
});


//post with best quote to the uber rush
app.get('/api/confirmQ/:q_id', function (request, response) {
    console.log('<<Confirm Delivery>>')
    var q_id = request.params.q_id;
    var delivery = UberRUSHClient.createDelivery(uber_delivery);
    console.log("Quote ID " + q_id);
    delivery.confirm({ quote_id: q_id }).then(function (self) {

        // var json_response = '{deliver_id : ' + self.delivery_id +
        //     ',delivery_eta : ' + self.dropoff.eta +
        //     ',pickup_eta : ' + self.pickup.eta +
        //     ',fee : ' + self.fee +
        //     '}';
        console.log("Delivery ID " + self.delivery_id);
        console.log("Delivery ETA :" + self.dropoff.eta);
        console.log("Pickup ETA :" + self.pickup.eta);
        console.log("Pickup Fee :" + self.fee);
        response.json(self);
    });

    //response.json(delivery.delivery_id);
});

//get status of the delivery
app.get('/api/getStatus/:delivery_id', function (request, response) {
    const d_id = request.params.delivery_id;
    var delivery = UberRUSHClient.createDelivery(uber_delivery);
    delivery.updateDeliveryInfo1(d_id).then(function (result){
        console.log(result);
        response.json(result);
    }).catch(err => {
        // Increment the number of polling failures on failure
        response.json(err);
      });
   
});

//manully update the status for the delivery
app.get('/api/updateStatus/:status', function (request, response) {
    var status = request.params.status;
    var delivery = UberRUSHClient.createDelivery(uber_delivery);
    console.log(status);
    delivery.updateStatus(status);
});




app.listen(PORT, function (err) {
    if (err) {
        console.log("Unable to launch app on the port" + PORT, err);
    }

    console.log("Running App on port" + PORT);
})

