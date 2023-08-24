'use strict';
const dotenv = require('dotenv').config(); // put this thing first, certainly before I 
const express = require('express'); // built in function for code running in the Node runtime.
const cors = require('cors');
// const axios = require('axios');
const handleWeatherRequest = require('./weather.js');

const PORT = process.env.PORT;

const app = express(); // create our express app, now we are ready to define some functionality.
app.use(cors()); // activates cross-origin-resource-sharing. allow other origins (besides localhost to make request to this code).


function Movie(id, title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn) {
  this.id = id;
  this.title = title;
  this.overview = overview;
  this.average_votes = averageVotes;
  this.total_votes = totalVotes;
  this.image_url = imageUrl;
  this.popularity = popularity;
  this.released_on = releasedOn;
}

app.get('/weather', handleWeatherRequest);

function formatMovieData(movieData) {
  const movieList = [];

  let numMovies = movieData.length < 10 ? movieData.length : 10;
  

  for (let i=0; i < numMovies; i++){
    if (movieData[i].poster_path) {
      let id = movieData[i].id;
      let title = movieData[i].title;
      let overview = movieData[i].overview;
      let averageVotes = movieData[i].vote_average;
      let totalVotes = movieData[i].vote_count;
      let imageUrl = 'https://image.tmdb.org/t/p/w500/' + movieData[i].poster_path;
      let popularity = movieData[i].popularity;
      let releasedOn = movieData[i].release_date;
      movieList.push(new Movie(id, title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn));
    }
  }

  movieList.sort((a, b) => b.popularity - a.popularity);
  
  return movieList;
}

app.get('/movies', async (request, response) => {
  let cityName = request.query.cityName;
  const tmdbURL = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${MOVIE_API_KEY}`;

  try {
    const rawMovieData = await axios.get(tmdbURL);
    let formattedMovies = formatMovieData(rawMovieData.data.results);
    response.status(200).send(formattedMovies);
  } catch (e) {
    response.status(500).send(`Ugh Oh ${e}`);
  }

});


app.listen(PORT, () => {
  console.log('Pauls App is listening...');
});









