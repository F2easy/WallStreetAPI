// Import Dependencies
const express = require('express')
const passport = require('passport')
const axios = require('axios');
const mongoose = require('mongoose');


// pull in Mongoose model for portfolio
const Portfolio = require('../models/Portfolio')
const customErrors = require('../../lib/custom_errors')
const Stock = require('../models/stock')
const User = require('../models/user')
// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// API Key and Variables
KEY=process.env.API_KEY

indx = process.env.INDX_URL
//show = process.env.SHW_URL

// testing with symbol for apple



// console.log(show) tested to see if url worked

// STOCK ROUTES







// SHOW page for stocks

router.get('/stocks/:symbol', (req, res, next) => {
 //let symbol = req.params.symbol; // Get the symbol from the request parameters
 	//console.log("ticker:", symbol)
 	let symbol = "AAPL"
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=cn2ngnhr01qt9t7uu8b0cn2ngnhr01qt9t7uu8bg`;

  axios.get(url)
    .then(apiRes => {
      if (!apiRes.data) {
        throw new Error('Stock not found');
      }
      const stockData = apiRes.data; // API response returns a single stock object
			console.log("stockData", stockData)
      const stock = {
				country: stockData.country,
        ticker: stockData.ticker,
        logo: stockData.logo,
        currency: stockData.currency,
        ipo: stockData.ipo,
				industry: stockData.finnhubIndustry,
				name: stockData.name,
				website: stockData.weburl
      };

      res.status(200).json({ stock });
    })
    .catch(error => {
      // Pass the error to the error handler middleware
      next(error);
    });
});


// Index Page for stocks

router.get('/stocks', (req, res, next) => {
  axios.get(indx) // Assuming "indx" is the API endpoint URL
    .then(apiRes => {
      console.log('This came back from the API:\n', apiRes.data);

      if (!apiRes.data) {
        throw new Error('API response data is missing or invalid');
      }

      const stocks = apiRes.data.filter(data => data.type === "Common Stock" || data.type === "Public").filter(data => data.currency === "USD")
        .map(data => ({
          description: data.description,
          symbol: data.symbol,
          currency: data.currency,
          type: data.type
        }));

      res.status(200).json({ stocks });
    })
    .catch(error => {
      // Pass the error to the error handler middleware
      next(error);
    });
});


module.exports = router
