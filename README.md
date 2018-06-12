# LIRI Node App

LIRI is a Language Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives you back data.

Type each of the following commands in the terminal to have LIRI do something.

**1. node liri.js my-tweets**

This will show my last 20 tweets and when they were created.

**2. node liri.js spotify-this-song song-name-here**

This will show the following information about the song you searched for

* Artist(s)
* The song's name
* A preview link of the song from Spotify
* The album that the song is from

If no song is provided, then LIRI will display info for "The Sign" by Ace of Base.

**3. node liri.js movie-this movie-name-here**

This will show the following information about the movie you searched for.

* Title of the movie.
* Year the movie came out.
* IMDB Rating of the movie.
* Rotten Tomatoes Rating of the movie.
* Country where the movie was produced.
* Language of the movie.
* Plot of the movie.
* Actors in the movie.

If no movie was provided, then LIRI will display info for "Mr. Nobody".

**4. node liri.js do-what-it-says**

LIRI will take the text inside random.txt and use it to call one of LIRI's commands.

### BONUS

In addition to logging the data to the terminal window, the data will be appended to file called "log.txt".