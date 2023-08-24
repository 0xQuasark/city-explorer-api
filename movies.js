'use strict';
const dotenv = require('dotenv').config(); // put this thing first, certainly before I 
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

const axios = require('axios');


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


const handleMovieRequest = async (request, response) => {
  console.log('movie refactor completed?');
  let cityName = request.query.cityName;
  const tmdbURL = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${MOVIE_API_KEY}`;

  try {
    const rawMovieData = await axios.get(tmdbURL);
    let formattedMovies = formatMovieData(rawMovieData.data.results);
    response.status(200).send(formattedMovies);
  } catch (e) {
    response.status(500).send(`Ugh Oh ${e}`);
  }
}


module.exports = handleMovieRequest;
