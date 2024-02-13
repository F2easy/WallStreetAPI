const mongoose = require('mongoose')

const PortfolioSchema = require('./Portfolio')

const stockSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		symbol: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
		},
		country: {
			type: String,
		},
		industry: {
			type: String,
		},
		summary: {
			type: String,
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Stock', stockSchema)

