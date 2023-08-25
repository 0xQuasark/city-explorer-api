'use strict';
const dotenv = require('dotenv').config(); // put this thing first, certainly before I 
const cache = require('./cache.js');
const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

async function getWeatherForecast(lat, lon) {
  const key = 'weather-' + lat + lon;
  const weatherEndpoint = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;
  // const weatherEndpoint = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I&days=7`;

  
  if (cache[key] && (Date.now() - cache[key].timestamp < 5000000)) {
    console.log('WEATHER: Cache hit');
  } else {
    console.log('WEATHER: Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    let rawWeatherData = await axios.get(weatherEndpoint);
    cache[key].data = rawWeatherData.data;
  }
  // console.log(cache[key].data);
  // console.log('Datestamp: ', Date.now());
  // console.log('cached timestamp: ', cache[key].timestamp);

  return cache[key].data;
}

function formatWeatherForecast(weather) {
  const forecastData = [];

  for (let i=0; i<weather.data.length; i++) {
    const datetime = weather.data[i].datetime;
    const cloudState = weather.data[i].weather.description;
    const lowTemp = weather.data[i].high_temp;
    const highTemp = weather.data[i].min_temp;
    
    const desc = `Low of ${lowTemp}, high of ${highTemp} with ${cloudState}`;

    forecastData.push(new Forecast(desc, datetime))
  }
  return forecastData;  
}
  
const handleWeatherRequest = async (request, response) => {
  // console.log('Weather Request for', request.query);
  // console.log('Movie Cache: ' + cache.movieCache);
  if (!request.query.city || !request.query.lat || !request.query.lon) {
    response.status(400).send('Not enough parameters given');
  } else {
    let weatherData = await getWeatherForecast(request.query.lat, request.query.lon);
    let formattedWeatherForecast = formatWeatherForecast(weatherData);
    // let formattedWeatherForecast = new Forecast('uncomment', 'the above two lines');
    response.status(200).send(formattedWeatherForecast);
  }
}


module.exports = handleWeatherRequest;
