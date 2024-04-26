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




// INDEX this route is to allow the logged in user to view their own portfolio
// GET /portfolio 
router.get('/portfolio', requireToken, (req, res, next) => {
  const userId = req.user._id; // Get the user ID from the authenticated user

  Portfolio.findOne({ owner: userId }) // Find the portfolio associated with the user ID
    .then((portfolio) => {
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const portfolioObject = portfolio.toObject(); // Convert the portfolio to a plain JavaScript object
      res.status(200).json({ portfolio: portfolioObject }); // Respond with the portfolio JSON
    })
    .catch(next);
});


router.get('/portfolio/:userId', (req, res, next) => {
  const userId = req.params.userId;


  Portfolio.findOne({ owner: userId }) // Find the portfolio where the owner matches the userId
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


// DESTROY Portfolios will also need to delete stocks from the portfolio
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

//addStock/:portfolioId
router.patch('/portfolio/:userId', (req, res, next) => {
	const userId = req.params.userId;
	const stock = req.body
	// console.log("stock", stock)
	// console.log("userID", userId)
  Portfolio.findOne({owner: userId})
    .then(portfolio => {
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }
			// console.log("portfolio", portfolio)
			// console.log("portfolio stocklist", portfolio.stockList)
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

// UPDATE
// PATCH /portfolio/5a7db6c74d55bc51bdf39793
router.patch('/myportfolio/:Id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	// delete req.body.portfolio.owner
	Portfolio.findById(req.params.Id)
  /// console.log('id is ', req.params.Id)
	// 	// .then(handle404)
  //   console.log('not 404')
		.then((portfolio) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
      console.log('req, portfolio', req && portfolio)
			// requireOwnership(req, portfolio)
      console.log('this is the req.body', req.body)
			// pass the result of Mongoose's `.update` to the next `.then`
			return portfolio.updateOne(req.body.portfolio)
        .then( portfolio.save()) // Save the updated portfolio

		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})





// Remove stocks
	router.delete('/portfolio/:stockID/:portID', requireToken, (req, res, next) => {
  const stockId = req.params.stockID
	console.log("stockId", stockId);
	const portId = req.params.portID
  Portfolio.findById(portId)
    .then(portfolio => {
      if (!portfolio) {
        throw new Error('Portfolio was not ever found');
      }
			portfolio.stockList.splice(portfolio.stockList.indexOf(portfolio.stockList.find((stock) => stock._id === stockId)),1)

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
