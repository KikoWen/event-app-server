var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Review = require('./review-model');

// this will be our data base's data structure 
var EventSchema = new Schema(
  {
    id: Number,
    name: String,
    description: String,
    cat_id:Number,
    user_id: Number,
    cost: String,
    location: String,
    time: String,
    photo:String,
    category: String
    
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

EventSchema.virtual('reviews', {
  ref: 'Review', // The model to use
  localField: 'id', // Find people where `localField`
  foreignField: 'event_id', // is equal to `foreignField`
  justOne: false

})

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('Event', EventSchema);