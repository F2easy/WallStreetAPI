const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: false,
		},
		country: {
			type: String,
			required: false,
		},
		industry: {
			type: String,
			required: false,
		}
	
	},
	{
		timestamps: true,
	}
)

module.exports =  stockSchema