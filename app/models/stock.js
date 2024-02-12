const mongoose = require('mongoose')

const PortfolioSchema = require('./Portfolio')

const stockSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
		industry: {
			type: String,
			required: true,
		},
		summary: {
			type: String,
			required: true,
		}
	
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Stock', stockSchema)

