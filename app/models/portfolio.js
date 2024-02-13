const mongoose = require('mongoose')

const stockSchema = require('./stock')


const portfolioSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		value: {
			type: Number,
			required: false,
		},
		country: {
			type: String,
			required: false,
		},
		StockList: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }],
			required: false,

		},

		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Portfolio', portfolioSchema)