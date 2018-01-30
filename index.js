var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const UberRUSH = require('uber-rush');
var PORT = process.env.PORT || 8080;


//setup uber-rush client with client_secret, client_id
const UberRUSHClient = UberRUSH.createClient({
    client_secret: '<CLIENT_SECRET>',
    client_id: '<CLIENT_ID>',
    sandbox: true,
    simulate : false
});


var delivery = UberRUSHClient.createDelivery({
    item: {
        title: 'Pizza Delivery',
        quantity: 1,
        is_fragile: true
    },
    pickup: {
        contact: {
            first_name: 'Phani',
            last_name: 'Turlapati',
            phone: {
              number: "+12356981236"
            }
        },
        location: {
            address: '1900 Oracle Way',
            city: 'Reston',
            state: 'VA',
            postal_code: '20190',
            country: 'US'
        }
    },
    dropoff: {
        contact: {
            first_name: 'Oracle PPL',
            last_name: 'PPs',
            phone: {
              number: "+15896541236"
            }
        },
        location: {
            address: '1910 Oracle Way',
            city: 'Reson',
            state: 'VA',
            postal_code: '20190',
            country: 'US'
        }
    }
});

//get all quotes for a location

app.get('/api/getAQ', function(request, response) {
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//post with best quote to the uber rush
app.get('/api/confirmQ/:q_id', function(request, response) {
    console.log('<<Confirm Delivery>>')
    var q_id = request.params.q_id; 
    //var q_id = request.body.quote; 
    console.log("Quote ID "+q_id);
    delivery.confirm({quote_id: q_id}).then(function(deliveries){
        console.log(deliveries.delivery_id);
        response.json(delivery.delivery_id);
    });
    console.log("Delivery ID "+delivery.delivery_id);
    //response.json(delivery.delivery_id);
});

//get status of the delivery
app.get('/api/getStatus', function(request, response) {
    const d_id = request.params.d_id; 
    // delivery.updateDeliveryInfo();
    // console.log(delivery.status);
    // response.json(delivery.status);
    delivery.updateDeliveryInfo().then(function(status){
        console.log(delivery.status);
        response.json(delivery.status);
    });
});

//manully update the status for the delivery
app.get('/api/updateStatus/:status', function(request, response) {
    var status = request.params.status; 
    console.log(status);
    response.json(delivery.updateStatus(status));
});



 
  app.listen(PORT, function(err) {
	if(err) {
		console.log("errr", err);
	}

	console.log("on port" + PORT);
})

