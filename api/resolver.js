var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();

  // note(seb): evolve this to pick up links too
  if (/^http:\/\/maps\.google\.com\/\S+/.test(term)) {
    handleIdString(term.replace(/^http:\/\/maps\.google\.com\//, ''), req, res);
  } else {
    // Else, assume it was a search string.
    handleSearchString(term, req, res);
  }
};

// todo(seb): need to build a way to parse out links
function handleIdString(id, req, res) {
  return;
}

function handleSearchString(term, req, res) {
  var response;
  try {
    response = sync.await(request({
      url: 'https://maps.googleapis.com/maps/api/place/details/json',
      qs: {
        placeid: term,
        key: key
      },
      gzip: true,
      json: true,
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  // todo(seb): extract this into its own template
  // todo(seb): extract open hours
  var html = '<div><h1 style="font-size: 34px">' + response.body.result.name + '</h1>' +
             '</h2>' + response.body.result.formatted_address + '</h2>' +
             '<p> Rating: <span style="font-color: #6DC995;">' + response.body.result.rating + '</span></p>' + 
             '</div>';
  res.json({
    body: html
  });
}
