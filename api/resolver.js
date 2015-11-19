var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();

  console.log('been here');
  console.log(req.query.text);

  if (/^http:\/\/giphy\.com\/\S+/.test(term)) {
    // Special-case: handle strings in the special URL form that are suggested by the commandHint
    // API. This is how the command hint menu suggests an exact Giphy image.
    handleIdString(term.replace(/^http:\/\/giphy\.com\//, ''), req, res);
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

  // Cap at 600px wide
  // todo(seb): extract this into its own template
  var html = '<div><p>' + response.body.result.name + '</div></p>';
  res.json({
    body: html
  });
}
