// Import Dependencies
const express = require('express')
const passport = require('passport')
const axios = require('axios');
const mongoose = require('mongoose');
// import { Request } from 'express';
// import { json } from 'express';

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





// Route to Display Data on Home Page
router.get('/',  (req, res, next) => {
  
  const generalNewsUrl = `https://finnhub.io/api/v1/news?category=general&token=cn2ngnhr01qt9t7uu8b0cn2ngnhr01qt9t7uu8bg`
  const mergerNewsUrl = `https://finnhub.io/api/v1/news?category=merger&minId=10&token=cn2ngnhr01qt9t7uu8b0cn2ngnhr01qt9t7uu8bg`
  const genNews = axios.get(generalNewsUrl)
  const mergeNews = axios.get(mergerNewsUrl)
  axios.all(getGenNews,getMergeNews)
  console.log(genNews)
  console.log(mergeNews)
    .then(axios.spread((genNews,mergeNews) => {
      const gen = genNews.data[0,1];
      const merge = mergeNews.data[0]
      if(!gen || !merge){
        throw new Error('News not found');
      }
    const news = {
    headlineGen: gen.headline,
    imageGen: gen.image,
    sourceGen: gen.source,
    summaryGen: gen.summary,
    urlGen: gen.url,
    imageMerge: merge.image,
    headlineMerge: merge.headline,
    sourceMerge: merge.source,
    summaryMerge: merge.summary,
    urlMerge: merge.url
    };
    res.status(200).json({ news });
  }))
  .catch(error => {
    // Pass the error to the error handler middleware
    next(error);
  });
});




// SHOW page for stocks

router.get('/stocks/:symbol', (req, res, next) => {

 	let symbol = req.params.symbol
  const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=cn2ngnhr01qt9t7uu8b0cn2ngnhr01qt9t7uu8bg`;
  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cn2ngnhr01qt9t7uu8b0cn2ngnhr01qt9t7uu8bg`
  const newsUrl = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2023-08-15&to=2023-08-20&token=cn2ngnhr01qt9t7uu8b0cn2ngnhr01qt9t7uu8bg`
  const getProfile = axios.get(profileUrl);
  const getQuote = axios.get(quoteUrl);
  const getNews = axios.get(newsUrl);
  
  axios.all([getProfile, getQuote, getNews])
    .then(axios.spread((profileRes, quoteRes, newsRes) => {
      const profileData = profileRes.data
      const quoteData = quoteRes.data
      const newsData = newsRes.data[1]
      if (!profileData || !quoteData) {
        throw new Error('Stock not found');
      }
      // console.log(profileData) // API response returns a single stock object
      // console.log(quoteData) // API response returns a set of stock Prices
      console.log("news", newsData)
      const stock = {
				country: profileData.country,
        ticker: profileData.ticker,
        logo: profileData.logo,
        currency: profileData.currency,
        ipo: profileData.ipo,
				industry: profileData.finnhubIndustry,
				name: profileData.name,
				website: profileData.weburl,
        exchange: profileData.exchange,
        currentPrice: quoteData.c,
        lowPrice: quoteData.l,
        highPrice: quoteData.h,
        openPrice: quoteData.o,
        prevClose: quoteData.pc,
        change: quoteData.d,
        percentChange: quoteData.dp,
        companyNews: newsData.headline,
        summary: newsData.summary,
        newsImage: newsData.image,
        source:  newsData.source
  
      };

      res.status(200).json({ stock });
    }))
    .catch(error => {
      // Pass the error to the error handler middleware
      next(error);
    });
});


// Index Page for stocks

router.get('/stocks', (req, res, next) => {
  axios.get(indx) // "indx" is the API endpoint URL
    .then(apiRes => {
      

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



router.post('/add', (req,res, next) => {
  const userId  = req.session

  const myStock = req.body
  myStock.owner = userId
  // default value for a checked box is 'on'
  // this line of code coverts it 2x
  // which results in a boolean value


  Stock.create(theStock)
	.then((portfolio) => {
		res.status(201).json({ portfolio: portfolio.toObject() })
	})
	// if an error occurs, pass it off to our error handler
	// the error handler needs the error message and the `res` object so that it
	// can send an error message back to the client
	.catch(next)
})









module.exports = router
