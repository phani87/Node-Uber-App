## Node Uber App :blue_car:

This is a node based Uber App built on Uber-Sandbox environment to deliver from a location to another. This was built using Uber Wrapper. 

## About

Uber provides Authentication and Rest API's which are available as methods in the Node Uber Wrapper. Leveraged those methods to create 
an application that would be available as REST APIs to create a delivery and check status during the entire delivery process. 
The code is written in <img src=static/download.png height=25 />


## Uber Support Libraries

## Installation

Before you begin, you need to register your app in the [Uber developer dashboard](https://developer.uber.com/dashboard). Notice that the app gets a client ID, secret, and server token required for authenticating with the API.

After registering your application, you need to install this module in your Node.js project:

```sh
npm install node-uber
```
https://developer.uber.com/docs/riders/guides/client-libraries

## Initialization

In order to use this module, you have to import it in your application first:

```javasctipt
var Uber = require('node-uber');
```

Next, initialize the Uber object with the keys you obtained from the [Uber developer dashboard](https://developer.uber.com/dashboard):

```javasctipt
var uber = new Uber({
  client_id: 'CLIENT_ID',
  client_secret: 'CLIENT_SECRET',
  server_token: 'SERVER_TOKEN',
  redirect_uri: 'REDIRECT URL',
  name: 'APP_NAME',
  language: 'en_US', // optional, defaults to en_US
  sandbox: true, // optional, defaults to false
  proxy: 'PROXY URL' // optional, defaults to none
});
```

> **Note**: For all available `language` options check out the [Localization page of the API](https://developer.uber.com/docs/localization).

```javascript
app.get('/api/login', function(request, response) {
  var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
  response.redirect(url);
});
```

The URL will lead to a page where your user will be required to login and approve access to his/her Uber account. In case that step was successful, Uber will issue an HTTP 302 redirect to the redirect_uri defined in the [Uber developer dashboard](https://developer.uber.com/dashboard). On that redirect, you will receive an authorization code, which is single use and expires in 10 minutes.

### Step two: Receive redirect and get an access token

To complete the authorization you now need to receive the callback and convert the given authorization code into an OAuth access token. You can accomplish that using `uber.authorizationAsync`. This method will retrieve and store the access_token, refresh_token, authorized scopes, and token expiration date within the uber object for consecutive requests.

Using Express, you could achieve that as follows:

```javascript
 app.get('/api/callback', function(request, response) {
    uber.authorizationAsync({authorization_code: request.query.code})
    .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
      // store the user id and associated access_token, refresh_token, scopes and token expiration date
      console.log('New access_token retrieved: ' + access_token);
      console.log('... token allows access to scopes: ' + authorizedScopes);
      console.log('... token is valid until: ' + tokenExpiration);
      console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

      // redirect the user back to your actual app
      response.redirect('/web/index.html');
    })
    .error(function(err) {
      console.error(err);
    });
});
```

## Method Overview

> **Nodeback**: Looking for nodeback-style methods? Check out the [nodeback-readme](README-Nodeback.md).

## [Riders API](https://developer.uber.com/docs/riders/introduction)

HTTP Method | Endpoint                          | Auth Method           | Required Scope                                 | Methods
----------- | --------------------------------- | --------------------- | ---------------------------------------------- | -------------------------------------------------
GET         | /v1.2/products                      | OAuth or server_token |                                                | products.getAllForAddressAsync
GET         | /v1.2/products                      | OAuth or server_token |                                                | products.getAllForLocationAsync
GET         | /v1.2/products/{product_id}         | OAuth or server_token |                                                | products.getByIDAsync
PUT         | /v1.2/sandbox/products/{product_id} | OAuth or server_token | (Sandbox mode)                                 | products.setSurgeMultiplierByIDAsync
PUT         | /v1.2/sandbox/products/{product_id} | OAuth or server_token | (Sandbox mode)                                 | products.setDriversAvailabilityByIDAsync
GET         | /v1.2/estimates/price               | OAuth or server_token |                                                | estimates.getPriceForRouteAsync
GET         | /v1.2/estimates/price               | OAuth or server_token |                                                | estimates.getPriceForRouteByAddressAsync
GET         | /v1.2/estimates/time                | OAuth or server_token |                                                | estimates.getETAForAddressAsync
GET         | /v1.2/estimates/time                | OAuth or server_token |                                                | estimates.getETAForLocationAsync
GET         | /v1.2/history                     | OAuth                 | history or history_lite                        | user.getHistoryAsync
GET         | /v1.2/me                            | OAuth                 | profile                                        | user.getProfileAsync
PATCH       | /v1.2/me                          | OAuth                 | profile                                        | user.applyPromoAsync
POST        | /v1.2/requests                      | OAuth                 | request (privileged)                           | requests.createAsync
GET         | /v1.2/requests/current              | OAuth                 | request (privileged) or all_trips (privileged) | requests.getCurrentAsync
PATCH       | /v1.2/requests/current              | OAuth                 | request (privileged)                           | requests.updateCurrentAsync
DELETE      | /v1.2/requests/current              | OAuth                 | request (privileged)                           | requests.deleteCurrentAsync
POST        | /v1.2/requests/estimate             | OAuth                 | request (privileged)                           | requests.getEstimatesAsync
GET         | /v1.2/requests/{request_id}         | OAuth                 | request (privileged)                           | requests.getByIDAsync
PATCH       | /v1.2/requests/{request_id}         | OAuth                 | request (privileged)                           | requests.updateByIDAsync
PUT         | /v1.2/sandbox/requests/{request_id} | OAuth                 | request (privileged & Sandbox mode )           | requests.setStatusByIDAsync
DELETE      | /v1.2/requests/{request_id}         | OAuth                 | request (privileged)                           | requests.deleteByIDAsync
GET         | /v1.2/requests/{request_id}/map     | OAuth                 | request (privileged)                           | requests.getMapByIDAsync
GET         | /v1.2/requests/{request_id}/receipt | OAuth                 | request_receipt (privileged)                   | requests.getReceiptByIDAsync
GET         | /v1.2/places/{place_id}             | OAuth                 | places                                         | places.getHomeAsync and places.getWorkAsync
PUT         | /v1.2/places/{place_id}             | OAuth                 | places                                         | places.updateHomeAsync and places.updateWorkAsync
GET         | /v1.2/payment-methods                | OAuth                 | request (privileged)                           | payment.getMethodsAsync


## Version History

The change-log can be found in the [Wiki: Version History](https://github.com/shernshiou/node-uber/wiki/Version-History).
