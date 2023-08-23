'use strict';
const dotenv = require('dotenv');
const express = require('express'); // built in function for code running in the Node runtime.
const cors = require('cors');
const weatherData = require(`./data/weather.json`);

dotenv.config();
const PORT = process.env.PORT;

const app = express(); // create our express app, now we are ready to define some functionality.
app.use(cors()); // activates cross-origin-resource-sharing. allow other origins (besides localhost to make request to this code).


class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

function generateData(city, lat, lon) {
  let forecastData = [];
  let cityData = weatherData.find(item => item.city_name === city);

  for (let key in cityData.data) {
    let newDateTime = cityData.data[key].datetime;
    
    let cloudState = cityData.data[key].weather.description;
    let lowTemp = cityData.data[key].low_temp;
    let highTemp = cityData.data[key].max_temp;
    let newDescription = `Low of ${lowTemp}, high of ${highTemp} with ${cloudState}`;

    forecastData.push(new Forecast(newDescription, newDateTime));
  }
  return(forecastData);
}

app.get('/weather', (request, response) => {
  // console.log('Weather parameters', request);
  if (!request.query.city || !request.query.lat || !request.query.lon) {
    response.status(400).send('Not enough parameters given');
  } else {
    const cityData = generateData(request.query.city, request.query.lat, request.query.lon);
    response.status(200).send(cityData);
  }
});


app.listen(PORT, () => {
  console.log('Pauls App is listening!!');
});
