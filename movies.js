'use strict';
const dotenv = require('dotenv').config(); // put this thing first, certainly before I 
const cache = require('./cache.js');
const axios = require('axios');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;


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
    // I only want responses with posters
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

async function getMovieData(cityName) {
  const key = cityName;
  const tmdbURL = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${MOVIE_API_KEY}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 5000000)) {
    console.log('MOVIE: Cache hit');
  } else {
    console.log('MOVIE: Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    let rawMovieData = await axios.get(tmdbURL);
    // console.log('raw movieData', rawMovieData.data);
    cache[key].data = rawMovieData.data;
  }
  // console.log(cache[key].data);
  // console.log('Datestamp: ', Date.now());
  // console.log('cached timestamp: ', cache[key].timestamp);
  // console.log('L62: ', cache[key].data.results)
  return cache[key].data.results;
}


const handleMovieRequest = async (request, response) => {
  // console.log('Movie Request for ', request.query);
  // console.log('Movie Cache: ' + cache.weatherCache);
  let cityName = request.query.cityName;

  try {
    const rawMovieData = await getMovieData(cityName);
    // console.log('raw: ', rawMovieData)
    let formattedMovies = formatMovieData(rawMovieData);
    // console.log('formatted: ', formattedMovies)
    response.status(200).send(formattedMovies);
  } catch (e) {
    response.status(500).send(`Ugh Oh ${e}`);
  }
}


module.exports = handleMovieRequest;
