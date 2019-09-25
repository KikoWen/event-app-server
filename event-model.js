var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Review = require('./review-model');
var Category = require('./category-model');

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
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

EventSchema.virtual('reviews', {
  ref: 'Review', // The model to use
  localField: 'id', // Find people where `localField`
  foreignField: 'event_id', // is equal to `foreignField`
  justOne: false

})
EventSchema.virtual('category', {
  ref: 'Category', // The model to use
  localField: 'cat_id', // Find people where `localField`
  foreignField: 'id', // is equal to `foreignField`
  justOne: true

})

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('Event', EventSchema);