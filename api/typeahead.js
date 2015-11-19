var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');

// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text;
  if (!term) {
    res.json([{
      title: '<i>(enter a place\'s name)</i>',
      text: ''
    }]);
    return;
  }

  var response;
  try {
    response = sync.await(request({
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
      qs: {
        query: term,
        key: key
      },
      gzip: true,
      json: true,
      timeout: 10 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  if (response.statusCode !== 200 || !response.body || !response.body.results) {
    res.status(500).send('Error');
    return;
  }

  console.log(response.body);

  var results = _.chain(response.body.results)
    .reject(function(place) {
      return !place || !place.name || !place.formatted_address;
    })
    .map(function(place) {
      return {
        title: '<div style="height:75px;">' + place.formatted_address + '</div>',
        text: place.place_id
      };
    })
    .value();

  if (results.length === 0) {
    res.json([{
      title: '<i>(no places)</i>',
      text: ''
    }]);
  } else {
    res.json(results);
  }
};
