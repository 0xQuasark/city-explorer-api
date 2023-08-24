'use strict';
const dotenv = require('dotenv').config(); // put this thing first, certainly before I 
const express = require('express'); // built in function for code running in the Node runtime.
const cors = require('cors');
// const axios = require('axios');
const handleWeatherRequest = require('./weather.js');
const handleMovieRequest = require('./movies.js');

const PORT = process.env.PORT;

const app = express(); // create our express app, now we are ready to define some functionality.
app.use(cors()); // activates cross-origin-resource-sharing. allow other origins (besides localhost to make request to this code).


app.get('/weather', handleWeatherRequest);
app.get('/movies', handleMovieRequest);


app.listen(PORT, () => {
  console.log('Pauls App (v3.1) is listening...');
});









