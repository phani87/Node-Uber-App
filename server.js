var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseurl = require('parseurl')
var Uber = require('node-uber');
var url = require('url');
var nue = require('./node-uber-eats/index.js');
var session = require('express-session');

var PORT = process.env.PORT || 8080;

// var uber = new Uber({
//   client_id: 'x12ZWFymkcThH2NkgkPxWQt3Sv4mPpNk',
//   client_secret: 'tpfmHr20Q2PNYsYyghHsl5x-eHRKDm2NCJXf8EY-',
//   server_token: '0jSLKHDTvnj3I6wz0EEXiv7meQaP22jc9TuO_t5Y',
//   redirect_uri: 'http://localhost:8080/api/callback',
//   name: 'MyTestEats',
//   base_version: 'v1',
//   language: 'en_US', // optional, defaults to en_US
//   sandbox: true, // optional, defaults to false
//   proxy: '' // optional, defaults to none
// });
//
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true
// }))

// app.use(function (req, res, next) {
//
//   var pathname = parseurl(req).pathname
//
//   console.log(pathname)
//
// })

app.get('/api/login',(something, somethingelse) => nue.getAQ);

app.get('/api/login/*', (something, somethingelse) => nue.login);

app.get('/api/callback',(something, somethingelse) => nue.getAuthToken);

app.get('/api/gq', (something, somethingelse) => nue.getAllQuotes);

app.listen(PORT, function(err) {
	if(err) {
		console.log("errr", err);
	}

	console.log("on port" + PORT);
})
