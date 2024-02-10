const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		value: {
			type: int,
			required: false,
		},
		country: {
			type: string,
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
