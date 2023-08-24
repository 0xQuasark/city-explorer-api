'use strict';
const dotenv = require('dotenv');
const express = require('express'); // built in function for code running in the Node runtime.
const cors = require('cors');
const axios = require('axios');
const weatherData = require(`./data/weather.json`);

dotenv.config();
const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

const app = express(); // create our express app, now we are ready to define some functionality.
app.use(cors()); // activates cross-origin-resource-sharing. allow other origins (besides localhost to make request to this code).


class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

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



async function getWeatherForecast(lat, lon) {
  const weatherEndpoint = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I&days=7`;
  let weatherResponse = await axios.get(`${weatherEndpoint}`);
  return weatherResponse.data;
}


function formatWeatherForecast(weather) {
  const forecastData = [];

  for (let i=0; i<weather.data.length; i++) {
    const datetime = weather.data[i].datetime;
    const cloudState = weather.data[i].weather.description;
    const lowTemp = weather.data[i].high_temp;
    const highTemp = weather.data[i].min_temp;
    
    const desc = `Low of ${lowTemp}, high of ${highTemp} with ${cloudState}`;
    console.log(datetime, desc)

    forecastData.push(new Forecast(desc, datetime))
  }
  return forecastData;  
}

app.get('/weather', async (request, response) => {
  // console.log('Weather parameters', request);
  if (!request.query.city || !request.query.lat || !request.query.lon) {
    response.status(400).send('Not enough parameters given');
  } else {
    let weatherData = await getWeatherForecast(request.query.lat, request.query.lon);
    let formattedWeatherForecast = formatWeatherForecast(weatherData);
    // let formattedWeatherForecast = new Forecast('uncomment', 'the above two lines');
    response.status(200).send(formattedWeatherForecast);
  }
});

function formatMovieData(movieData) {
  const movieList = [];

  for (let i=0; i<movieData.length; i++){
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









