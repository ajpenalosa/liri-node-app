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

        var twitterParameters = {
            count: 20
        }
    
        client.get('statuses/user_timeline', twitterParameters, function(error, tweets) {
            if(error) throw error;

            // console.log(tweets);

            console.log("\r\nThese are my latest " + twitterParameters.count + " tweets:\r\n")

            for ( var i = 0; i < tweets.length; i++ ) {
                console.log(tweets[i].created_at.slice(0, 16) + ": " + tweets[i].text);
            }

            console.log("\r\n")
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