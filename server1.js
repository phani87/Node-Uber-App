var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseurl = require('parseurl')
var Uber = require('node-uber');
var url = require('url');
var nue = require('./node-uber-rush/index.js');


var PORT = process.env.PORT || 8080;


var Uber = require('node-uber');




app.get('/api/getAQ', function(request, response) {
    response.redirect('/api/login');
  });

  var uber = new Uber({
    client_id: 'x12ZWFymkcThH2NkgkPxWQt3Sv4mPpNk',
    client_secret: 'tpfmHr20Q2PNYsYyghHsl5x-eHRKDm2NCJXf8EY-',
    server_token: '0jSLKHDTvnj3I6wz0EEXiv7meQaP22jc9TuO_t5Y',
    redirect_uri: 'http://localhost:8080/api/getQuotes',
    name: 'MyTestEats',
    base_version: 'v1',
    language: 'en_US', // optional, defaults to en_US
    sandbox: true, // optional, defaults to false
    proxy: '' // optional, defaults to none
  });

app.get('/api/login', function(request, response) {
    
    var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places', 'delivery']);
    console.log(url);
    response.redirect(url);
  });

app.get('/api/getQuotes', function(request, response) {
    uber.authorizationAsync({authorization_code: request.query.code})
    .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
      // store the user id and associated access_token, refresh_token, scopes and token expiration date
      console.log('New access_token retrieved: ' + access_token);
      console.log('... token allows access to scopes: ' + authorizedScopes);
      console.log('... token is valid until: ' + tokenExpiration);
      console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

      // redirect the user back to your actual app
      console.log(request);
      response.redirect('/api/getAllQuotes');
    })
    .error(function(err) {
      console.error(err);
    });
});

app.get('/api/getAllQuotes', function(request, response) { 
    console.log('getAllQuotes');
    var location_object = {
    "dropoff": { "location": { "address": "530 W 113th Street", "address_2": "Floor 2", "city": "New York", "country": "US", "postal_code": "10025", "state": "NY" } },
    "pickup": { "location": { "address": "636 W 28th Street", "address_2": "Floor 2", "city": "New York", "country": "US", "postal_code": "10001", "state": "NY" } }
  };

  uber.delivery.getAllQuotes(location_object, function(err, res) {
    if (err)
      console.error(err);
    else
      response.json(res);
  });});

  
app.listen(PORT, function(err) {
	if(err) {
		console.log("errr", err);
	}

	console.log("on port" + PORT);
})
