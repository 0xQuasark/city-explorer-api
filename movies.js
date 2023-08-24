'use strict';
const dotenv = require('dotenv').config(); // put this thing first, certainly before I 
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

const axios = require('axios');


module.exports = handleMovieRequest;
