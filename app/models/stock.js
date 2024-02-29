const mongoose = require('mongoose')


const stockSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: false,
		},
		ticker: {
			type: String,
			required: false,
		},
		country: {
			type: String,
		},
		industry: {
			type: String,
		},
		logo: {
			type: String,
		},
		website: {
			type: String,
		},
		currency: {
			type: String,
		},
		ipo: {
			type: String,
		}
		}
)

module.exports =  stockSchema

