// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')


//API urls


// pull in Mongoose model for portfolio
const Portfolio = require('../models/Portfolio')
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { porfolio: { title: '', text: 'foo' } } -> { portfolio: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /portfolio
router.get('/portfolio', requireToken, (req, res, next) => {
	Portfolio.find()
		.then((portfolio) => {
			// `portfolio` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return portfolio.map((port) => port.toObject())
		})
		// respond with status 200 and JSON of the portfolio
		.then((portfolio) => res.status(200).json({ portfolio: portfolio }))
		// if an error occurs, pass it to the handler
		.catch(next)
})


router.get('/portfolio/:id', requireToken, (req, res, next) => {
  const portfolioId = req.params.id;

  Portfolio.findById(portfolioId)
    .populate('StockList', '-createdAt -updatedAt') // Populate the StockList field and exclude createdAt and updatedAt fields
    .populate('owner', 'username') // Populate the owner field and include only the username
    .then(portfolio => {
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const portfolioData = portfolio.toObject();

      res.status(200).json({ portfolio: portfolioData });
    })
    .catch(error => {
      // Pass the error to the error handler middleware
      next(error);
    });
});



// UPDATE
// PATCH /portfolio/5a7db6c74d55bc51bdf39793
// router.patch('/portfolio/:id', requireToken, removeBlanks, (req, res, next) => {
// 	// if the client attempts to change the `owner` property by including a new
// 	// owner, prevent that by deleting that key/value pair
// //	delete req.body.portfolio.owner
//   //console.log(req.body)
// 	Portfolio.findById(req.params.id)
// 		.then(handle404)
// 		.then((portfolio) => {
// 			// pass the `req` object and the Mongoose record to `requireOwnership`
// 			// it will throw an error if the current user isn't the owner
// 			requireOwnership(req, portfolio)

// 			// pass the result of Mongoose's `.update` to the next `.then`
// 			return portfolio.updateOne(req.body.portfolio)
// 		})
// 		// if that succeeded, return 204 and no JSON
// 		.then(() => res.sendStatus(204))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })

// DESTROY Portfolios will also need to delte stocks from the portfolio
// DELETE /Portfolio/5a7db6c74d55bc51bdf39793
router.delete('/portfolio/:id', requireToken, (req, res, next) => {
	Portfolio.findById(req.params.id)
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

// Adds Stock to stockList array in portfolio 
// GET /add/:portfolioId/:stockId


router.patch('/portfolio/:userId', requireToken, (req, res, next) => {
	const userId = req.params.userId;
	const stock = req.body
	//console.log("req.params", req.params)
  Portfolio.find({owner: userId})
    .then(portfolio => {
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      portfolio.stockList.push(stock); // Add the stock symbol to the stockList array

      return portfolio.save(); // Save the updated portfolio
    })
    .then(updatedPortfolio => {
      res.status(200).json(updatedPortfolio); // Send back the updated portfolio
    })
    .catch(error => {
      // Pass the error to the error handler middleware
      next(error);
    });
});




// CREATE Portfolios
// POST /portfolio
router.post('/portfolio', requireToken, (req, res, next) => {
	// set owner of new portfolio to be current user
	req.body.portfolio.owner = req.user.id
	// console.log(('this is the owner: '), req.user.id)
	Portfolio.create(req.body.portfolio)
		// respond to succesful `create` with status 201 and JSON of new "portfolio"
		.then((portfolio) => {
			res.status(201).json({ portfolio: portfolio.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})


router.post('/portfolio/:portfolioId/:stockSymbol', requireToken, (req, res, next) => {
  const portfolioId = req.params.id;
  const ticker = req.params.stockSymbol;
  console.log("portfolioId:", portfolioId);

	console.log("req.params", req.params);
  Portfolio.findById(portfolioId)
    .then(portfolio => {
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      portfolio.stockList.push({ ticker }); // Add the ticker as an object to the StockList array

      return portfolio.save(); // Save the updated portfolio
    })
    .then(updatedPortfolio => {
      res.status(200).json(updatedPortfolio); // Send back the updated portfolio
    })
    .catch(error => {
      // Pass the error to the error handler middleware
      next(error);
    });
});


module.exports = router
