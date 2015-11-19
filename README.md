# Places Slash Command for Mixmax

This is an open source Mixmax Slash Command. See <http://sdk.mixmax.com/docs/tutorial-giphy-slash-command> for more information about how to use this example code in Mixmax.

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To simulate locally how Mixmax calls the typeahead URL (to return a JSON list of typeahead results), run:

```
curl http://localhost:9145/typeahead?text=<place name>
```

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl http://localhost:9145/resolver?text=<place name>
```


## How this works behind the scenes?

During the typeahead phase, all requests are made to the Google Places API Text Search Service to fetch general details fitting your query. 

Once you select one of the places, it ends up passing to the resolver a ```place_id```. This property is used to call the Google Places API Place Details Service and actually get more details about the specific place you selected. 

## Setup

In order to make this work, you will need a Google API Key. I hope this link is still working when you're planning to get your own keys: https://console.developers.google.com/apis

I've used a simple browser key allowed to access the Google Maps API, but be aware that you have a limited amount of requests you can do on the free tier.
