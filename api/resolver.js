var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();

  console.log('been here');

  if (/^http:\/\/giphy\.com\/\S+/.test(term)) {
    // Special-case: handle strings in the special URL form that are suggested by the commandHint
    // API. This is how the command hint menu suggests an exact Giphy image.
    handleIdString(term.replace(/^http:\/\/giphy\.com\//, ''), req, res);
  } else {
    // Else, assume it was a search string.
    handleSearchString(term, req, res);
  }
};

function handleIdString(id, req, res) {
  var response;
  try {
    response = sync.await(request({
      url: 'http://api.giphy.com/v1/gifs/' + encodeURIComponent(id),
      qs: {
        api_key: key
      },
      gzip: true,
      json: true,
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  var image = response.body.data.images.original;
  var width = image.width > 600 ? 600 : image.width;
  var html = '<p><img style="max-width:100%; border: 1px solid green;" src="' + image.url + '" width="' + width + '"/></p>';
  res.json({
    body: html
  });
}

function handleSearchString(term, req, res) {
  var response;
  try {
    response = sync.await(request({
      url: 'http://api.giphy.com/v1/gifs/random',
      qs: {
        tag: term,
        api_key: key
      },
      gzip: true,
      json: true,
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  var data = response.body.data;
  console.log(response.body.data);

  // Cap at 600px wide
  var width = data.image_width > 600 ? 600 : data.image_width;
  var html = '<p><img style="max-width:100%;" src="' + data.image_url + '" width="' + width + '"/></p>';
  res.json({
    body: html
  });
}
