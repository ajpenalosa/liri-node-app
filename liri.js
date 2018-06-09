require("dotenv").config();

// Requiring modules
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

// Importing keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Variable to store command
var command = process.argv[2];

// Switch to determine which command to use
switch (command) {

    case "my-tweets":

        // Limiting the amount of tweets to display
        var twitterParameters = {
            count: 20
        }
    
        // Calling the twitter API
        client.get('statuses/user_timeline', twitterParameters, function(error, tweets) {
            if(error) throw error;

            console.log("\r\nThese are my latest " + twitterParameters.count + " tweets:\r\n")

            for ( var i = 0; i < tweets.length; i++ ) {
                console.log(tweets[i].created_at.slice(0, 16) + ": " + tweets[i].text);
            }

            console.log("\r\n")
        });

    break;

    // Spotify command

    case "spotify-this-song":

        // Variable to hold song name
        var songName = "";

        if ( process.argv.length >= 4 ) {

            // Looping through process.argv starting at index 3 to get the whole song name
            for ( var i = 3; i < process.argv.length; i ++ ) {
                if ( i === 3 ) {
                    songName = songName + process.argv[i];
                } 
                else {
                    songName = songName + " " + process.argv[i];
                }
            }

        }

        else {
            console.log("The Sign, by Ace of Base");
            songName = "The Sign Ace of Base";
        }

        var searchProperties = { 
            type: 'track', 
            query: songName,
            limit: 5
        }

        // Calling the Spotify API
        spotify.search( searchProperties, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            for ( var i = 0; i < data.tracks.items.length; i++ ) {
                console.log("\r\n#" + (i+1) );
                console.log("Song Name: " + data.tracks.items[i].name);
                console.log("Artist: " + data.tracks.items[i].artists[0].name);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("Preview Link: " + data.tracks.items[i].preview_url);
            }

            console.log("\r\n");

        });

    break;

    case "movie-this":

    console.log("Movies");

    break;

    case "do-what-it-says":

    console.log("do this yo!");

    break;

}