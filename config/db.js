'use strict'
// allow for grabbing stuff from the env file
require('dotenv').config()

// creating a base name for the mongodb
// REPLACE THE STRING WITH YOUR OWN DATABASE NAME


// create the mongodb uri for development and test
// this code is for a local instance of mondoDB
// const database = {
// 	development: `mongodb://localhost/${mongooseBaseName}-development`,
// 	test: `mongodb://localhost/${mongooseBaseName}-test`,
// }
// This is for an Atlas instance of mongoDB
const database = {
	development: process.env.MONGODB_URI,
	test: process.env.MONGODB_URI,
}

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development

// Environment variable MONGODB_URI will be available in
// heroku production evironment otherwise use test or development db
const currentDb = process.env.MONGODB_URI || localDb

module.exports = currentDb
