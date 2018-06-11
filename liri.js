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

// Empty variables to be used later
var search = "";
var log = [];

function myTweets() {

    // Limiting the amount of tweets to display
    var twitterParameters = {
        count: 20
    }

    // Calling the twitter API
    client.get('statuses/user_timeline', twitterParameters, function(error, tweets) {
        if(error) throw error;

        var message = "\r\nThese are my latest " + twitterParameters.count + " tweets:\r\n";
        var tweet = "";
        console.log(message);

        // Push message to log array
        log.push(message + "\r\n");

        for ( var i = 0; i < tweets.length; i++ ) {
            tweet = tweets[i].created_at.slice(0, 16) + ": " + tweets[i].text;
            console.log(tweet);

            // Push the tweet to the log array
            log.push(tweet + "\r\n");
        }

        console.log(" ");

        // Calling the log function to append to log.txt
        dataLog();
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
        songName = "The Sign Ace of Base";
    }

    var message = "\r\nSpotify search for: " + songName;
    console.log(message);
    log.push(message + "\r\n");

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

        // If your search returned no results
        if ( data.tracks.total === 0 ) {
            var results = "\r\nYour search returned no results.\r\n";
            console.log(results);
            log.push(results);
            dataLog();
            return;
        }

        for ( var i = 0; i < data.tracks.items.length; i++ ) {

            // Declaring variables for song information 
            var resultNumber = "\r\n#" + (i+1)
            var songName = "Song Name: " + data.tracks.items[i].name;
            var artist = "Artist: " + data.tracks.items[i].artists[0].name;
            var album = "Album: " + data.tracks.items[i].album.name;
            var previewLink = "";

            // If the song is The Sign, by Ace of Base
            if ( data.tracks.items[i].name === "The Sign" && data.tracks.items[i].artists[0].name === "Ace of Base" ) {

                // Console logging the information
                console.log("\r\n" + songName);
                console.log(artist);
                console.log(album);
                previewLink = "Preview Link: " + data.tracks.items[i].preview_url;
                console.log(previewLink);

                // Logging the information to log.txt
                log.push("\r\n" + songName + "\r\n");
                log.push(artist + "\r\n");
                log.push(album + "\r\n");
                log.push(previewLink + "\r\n");
                
                break;

            }
            else {

                // Console logging the information
                console.log(resultNumber);
                console.log(songName);
                console.log(artist);
                console.log(album);
                if (data.tracks.items[i].preview_url) {
                    previewLink = "Preview Link: " + data.tracks.items[i].preview_url;
                }
                else {
                    previewLink = "Preview Link: N/A";
                }
                console.log(previewLink);
    
                // Logging the information to log.txt
                log.push(resultNumber + "\r\n");
                log.push(songName + "\r\n");
                log.push(artist + "\r\n");
                log.push(album + "\r\n");
                log.push(previewLink + "\r\n");

            }
            
        }

        console.log(" ");

        dataLog();

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

    var logMessage = "Movie search for: " + movieName.replace(/[+]+/g, ' ');
    log.push(logMessage + "\r\n");

    // Run request to OMDB API
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        // Store the body in a variable
        var object = JSON.parse(body);
    
      // If the request is successful and movie is found
      if ( !error && response.statusCode === 200 && object.Response === "True" ) {

        var title = "\r\nTitle: " + object.Title;
        var year = "Year: " + object.Year;
        var imdbRating = "IMDB Rating: " + object.imdbRating;
        var rottenTomatoes = "";

        // Store the ratings object in a variable
        var ratings = object.Ratings;

        console.log(title);
        console.log(year);
        console.log(imdbRating);

        log.push(title + "\r\n");
        log.push(year + "\r\n");
        log.push(imdbRating + "\r\n");

        // Loop through ratings to find Rotten Tomatoes
        for ( var i = 0; i < ratings.length; i++ ) {
            if ( ratings[i].Source === "Rotten Tomatoes") {
                rottenTomatoes = "Rotten Tomatoes Rating: " + ratings[i].Value
                console.log("Rotten Tomatoes Rating: " + ratings[i].Value);
                log.push(rottenTomatoes + "\r\n");
            }
        }

        var country = "Country: " + object.Country;
        var language = "Language: " + object.Language;
        var plot = "Plot: " + object.Plot;
        var actors = "Actors: " + object.Actors + "\r\n";

        console.log(country);
        console.log(language);
        console.log(plot);
        console.log(actors);

        log.push(country + "\r\n");
        log.push(language + "\r\n");
        log.push(plot + "\r\n");
        log.push(actors + "\r\n");
      }
      else {

        var message = "\r\n" + object.Error + "\r\n";

        // Console log "Movie not found"
        console.log(message);
        log.push(message + "\r\n");

      }

      dataLog();

    });

}; // End of movieThis()

function doWhatItSays() {

    log.push("\r\nLIRI: Do what it says.\r\n");

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console
        if (error) {
            return console.log(error);
        }

        // Split the text by the comma
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

function dataLog() {

    for ( var i = 0; i < log.length; i++ ) {

        // We then append the content into the file
        // If the file didn't exist then it gets created on the fly.
        fs.appendFileSync("log.txt", log[i], function(err) {
    
            // If an error was experienced we say it.
            if (err) {
                console.log(err);
            }
    
        });

    }

} // End of dataLog()

theSwitch();