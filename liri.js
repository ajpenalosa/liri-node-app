require("dotenv").config();

// Requiring modules
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");

// Importing keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Variable to store command
var command = process.argv[2];

// Empty variable to be used later
var search = "";

function myTweets() {

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

        console.log(" ");
    });

}; // End of myTweets()

function spotifyThisSong() {

    // Variable to hold song name
    var songName = "";

    if ( process.argv.length >= 4 && search === "" ) {

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

    else if ( search !== "" ) {
        songName = search;
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

        if ( data.tracks.total === 0 ) {
            console.log("\r\nYour search returned no results.");
        }

        for ( var i = 0; i < data.tracks.items.length; i++ ) {
            console.log("\r\n#" + (i+1) );
            console.log("Song Name: " + data.tracks.items[i].name);
            console.log("Artist: " + data.tracks.items[i].artists[0].name);
            console.log("Album: " + data.tracks.items[i].album.name);
            if (data.tracks.items[i].preview_url) {
                console.log("Preview Link: " + data.tracks.items[i].preview_url);
            }
            else {
                console.log("Preview Link: N/A");
            }
        }

        console.log(" ");

        // console.log("\r\n" + JSON.stringify(data.tracks.items[0], null, 2) + "\r\n");

    });

}; // End of spotifyThisSong()

function movieThis() {
    
    // Store all of the arguments in an array
    var nodeArgs = process.argv;

    // Create an empty variable for holding the movie name
    var movieName = "";

    // Loop through all the words in the node argument
    for (var i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
        }
        else {
            movieName += nodeArgs[i];
        }
    }

    // If no movie is input, use Mr. Nobody
    if ( nodeArgs.length === 3 && search === "" ) {
        movieName = "Mr. Nobody";
    }

    else if ( search !== "" ) {
        movieName = search;
    }

    // Run request to OMDB API
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        // Store the body in a variable
        var object = JSON.parse(body);
    
      // If the request is successful and movie is found
      if ( !error && response.statusCode === 200 && object.Response === "True" ) {

        // Store the ratings object in a variable
        var ratings = object.Ratings;

        console.log("\r\nTitle: " + object.Title);
        console.log("Year: " + object.Year);
        console.log("IMDB Rating: " + object.imdbRating);

        // Loop through ratings to find Rotten Tomatoes
        for ( var i = 0; i < ratings.length; i++ ) {
            if ( ratings[i].Source === "Rotten Tomatoes") {
                console.log("Rotten Tomatoes Rating: " + ratings[i].Value);
            }
        }

        console.log("Country: " + object.Country);
        console.log("Language: " + object.Language);
        console.log("Plot: " + object.Plot);
        console.log("Actors: " + object.Actors + "\r\n");
      }
      else {

        // Console log "Movie not found"
        console.log("\r\n" + object.Error + "\r\n");
      }
    });

}; // End of movieThis()

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console
        if (error) {
            return console.log(error);
        }

        // This the text by the comma
        var dataArr = data.split(",");

        // Store the first half in a variable
        command = dataArr[0];

        console.log("\r\nCommand: " + command);

        if ( dataArr.length === 2 ) {
            // Store the second half in a variable and remove the quotes
            search = (dataArr[1]).replace(/['"]+/g, '');
            console.log("Search: " + search);
        }

        theSwitch();

    });

}

function theSwitch() {

    // Switch to determine which function to use
    switch (command) {
    
        case "my-tweets":
    
            myTweets();
    
        break;
    
        case "spotify-this-song":
    
            spotifyThisSong();
    
        break;
    
        case "movie-this":
    
            movieThis();
    
        break;
    
        case "do-what-it-says":
    
            doWhatItSays();
    
        break;
    
    }; // End of Switch

}; // End of theSwitch()

theSwitch();