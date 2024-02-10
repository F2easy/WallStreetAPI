const mongoose = require('mongoose')

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
			type: Array,
			required: false,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('porfolio', portfolioSchema)
