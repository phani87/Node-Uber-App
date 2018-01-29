var Uber = require('node-uber');

function getAQ(request, response) {
    
  console.log('Getting AQ');
  // create new Uber instance
  var uber = new Uber({
    client_id: 'x12ZWFymkcThH2NkgkPxWQt3Sv4mPpNk',
    client_secret: 'tpfmHr20Q2PNYsYyghHsl5x-eHRKDm2NCJXf8EY-',
    server_token: '0jSLKHDTvnj3I6wz0EEXiv7meQaP22jc9TuO_t5Y',
    redirect_uri: 'http://localhost:8080/api/callback',
    name: 'MyTestEats',
    base_version: 'v1',
    language: 'en_US', // optional, defaults to en_US
    sandbox: true, // optional, defaults to false
    proxy: '' // optional, defaults to none
  });

  // get authorization URL
  var authURL = uber.getAuthorizeUrl(['history', 'profile', 'request', 'places', 'delivery']);

  // redirect user to the authURL

  // the authorizarion_code will be provided via the callback after logging in using the authURL
  uber.authorizationAsync({
          authorization_code: request.query.code
      })
      .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
          // store the user id and associated access_token, refresh_token, scopes and token expiration date
          console.log('New access_token retrieved: ' + access_token);
          console.log('... token allows access to scopes: ' + authorizedScopes);
          console.log('... token is valid until: ' + tokenExpiration);
          console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

          // chain the promise to retrive all products for location
          return uber.products.getAllForLocationAsync(3.1357169, 101.6881501);
      })
      .then(function(res) {
          // response with all products
          console.log(res);
      })
      .error(function(err) {
          console.error(err);
      });

}
