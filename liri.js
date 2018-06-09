require("dotenv").config();

// Requiring modules
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

// Importing keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

switch (command) {

    case "my-tweets":
    
        client.get('favorites/list', function(error, tweets, response) {
            if(error) throw error;
            console.log(tweets);  // The favorites.
            console.log(response);  // Raw response object.
        });

    break;

    case "spotify-this-song":

    console.log("Spotify");

    break;

    case "movie-this":

    console.log("Movies");

    break;

    case "do-what-it-says":

    console.log("do this yo!");

    break;

}