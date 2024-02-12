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

// API Key
KEY=process.env.API_KEY

indx = process.env.INDX_URL

// STOCK ROUTES


// DESTROY will delete stocks from portfolio but might cause issues because we don't know what to use to find stocks yet
// DELETE /portfolio/stocks/5a7db6c74d55bc51bdf39793
router.delete('/portfolio/stocks/:id', requireToken, (req, res, next) => {
	Porfolio.findById(req.params.id)
		.then(handle404)
		.then((portfolio) => {
			// throw an error if current user doesn't own 'portfolio`
			requireOwnership(req, portfolio)
			// delete the portfolio ONLY IF the above didn't throw
			portfolio.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})


// SHOW page for individual stocks
// GET /stock/5a7db6c74d55bc51bdf39793
// need to know how we are going to find stocks by
// remove the require token because we want everyone to be able to view stocks even without an account 
router.get('/stock/:id',  (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Stock.findById(req.params.id) // what are we going to find stocks by ??????
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "stock" JSON
		.then((Stock) => res.status(200).json({ Stock: Stock.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})


// Index Page for stocks

router.get('/stocks', (req, res, next) => {
  // Making API call using axios
  axios.get(indx) // "indx" is the API endpoint URL
    .then(apiRes => {
      console.log('This came back from the API:\n', apiRes.data);
      
      // Map through the data results and extract desired properties
      const stocks = apiRes.data.map(data => ({
        description: data.description,
        symbol: data.symbol,
        currency: data.currency,
        type: data.type
      }));

      // Respond with status 200 and JSON containing the extracted stock data
      res.status(200).json({ stocks });
    })
    .catch(error => {
      // Pass any error to the error handler middleware
      next(error);
    });
});



module.exports = router
