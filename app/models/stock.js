const mongoose = require('mongoose')


const stockSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		ticker: {
			type: String,
			required: true,
		},
		country: {
			type: String,
		},
		finnhubIndustry: {
			type: String,
		},
		logo: {
			type: String,
		}
	}
)

module.exports =  stockSchema

