var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Event = require('./event-model');

// this will be our data base's data structure 
var UserSchema = new Schema(
  {
    id: Number,
    name: String,
    username: String,
    password: String,
    role: String,
    email: String,
    photo: String,
    savedEvents:[Number]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

UserSchema.virtual('bookmarks', {
  ref: 'Event', // The model to use
  localField: 'savedEvents', // Find people where `localField`
  foreignField: 'id', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('User', UserSchema);