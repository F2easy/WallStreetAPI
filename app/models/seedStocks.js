// give some initial stocks in the db
// which will make it easy to test my routes

// this file will be run with a script command in the terminal
// we will set that script command up in package.json
// the command will be 'npm run seed'

// const mongoose = require('mongoose')

// const db = require('../../config/db')
// const Portfolio = require('./Portfolio')

// const testStocks = [
//   {name: 'tech', value: 7, country: 'USA', StockList: ['apple', 'micro', 'tesla']},
//   {name: 'finance', value: 9, country: 'USA', StockList: ['WF', 'BOA', 'VG']},
//   {name: 'RealEstate', value: 3, country: 'USA', StockList: ['BH', 'KG', 'SW']},
// ]


// // first establish a connection to the db
// // then remove all stocks that do not have an owner
// //then, insert all the starter stocks from the testStocks array 
// // then, most importantly close the connection to the DB

// mongoose.connect(db, {useNewUrlParser: true})
//     .then(() => {
//       Portfolio.deleteMany({ owner: null})
//         .then(deletedPortfolio => {
//           console.log('deleted portfolio in seed script:', deletedPortfolio)

//         Portfolio.create(testStocks)
//           .then(newPortfolio => {
//               console.log('new Portfolio added to db: \n', newPortfolio)
//               // VERY IMPORTANT
//              mongoose.connection.close()
//           })
//           .catch(error => {
//             console.log('an error has occured: \n', error)

//             // VERY IMPORTANT
//              mongoose.connection.close()
//           })
//      })
//      .catch(error => {
//        console.log('an error has occured: \n', error)

//         // VERY IMPORTANT
//         mongoose.connection.close()
//       })
//       .catch(error => {
//         console.log('an error has occured: \n', error)
 
//          // VERY IMPORTANT
//          mongoose.connection.close()
//       })
//   })