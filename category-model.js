var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Event = require('./event-model');

// this will be our data base's data structure 
var CategorySchema = new Schema(
  {
    id: Number,
    name: String,
  },
  { timestamps: true,toJSON: { virtuals: true } }
);

CategorySchema.virtual('events', {
  ref: 'Event', // The model to use
  localField: 'id', // Find people where `localField`
  foreignField: 'cat_id', // is equal to `foreignField`
  justOne: false,
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('Category', CategorySchema);