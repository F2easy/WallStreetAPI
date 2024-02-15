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

