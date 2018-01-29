var getSession = require('./getSession.js');


function getAllQuotes(request, response, next) {
  console.log("getAllQuotes");
  // try get session
  var uber = getSession(request, response);

  uber.redirect_uri = ""

  // this is our production database
  var location_object = {
    "dropoff": { "location": { "address": "530 W 113th Street", "address_2": "Floor 2", "city": "New York", "country": "US", "postal_code": "10025", "state": "NY" } },
    "pickup": { "location": { "address": "636 W 28th Street", "address_2": "Floor 2", "city": "New York", "country": "US", "postal_code": "10001", "state": "NY" } }
  };

  uber.delivery.getAllQuotes(location_object, function(err, res) {
    if (err)
      console.error(err);
    else
      response.json(res);
  });

}



module.exports = getAllQuotes;
