var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    review: String,
    category: String
    
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('Event', EventSchema);