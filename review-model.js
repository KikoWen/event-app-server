var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user-model');

// this will be our data base's data structure 
var ReviewSchema = new Schema(
	{
	    id: Number,
	    title: String,
		comment: String,
		review_id: Number,
	    user_id: Number,
	    event_id: Number,
   	},
  	{ 
	  	timestamps: true,
	  	toJSON: { virtuals: true }
  	}
);

ReviewSchema.virtual('user', {
	ref: 'User', // The model to use
	localField: 'user_id', 
	foreignField: 'id', 
	justOne: true,
});


// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('Review', ReviewSchema);