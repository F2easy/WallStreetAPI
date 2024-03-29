const mongoose = require('mongoose')

const stocksSchema = require('./stock')


const portfolioSchema = new mongoose.Schema(
	{
		portName: {
			type: String,
			required: true,
			unique: true,
		},
		country: {
			type: String,
			required: false,
		},
		stockList: [stocksSchema],

		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Portfolio', portfolioSchema)