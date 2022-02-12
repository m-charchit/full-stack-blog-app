const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const User  = new mongoose.Schema({
  username :{
      type  : String,
      required : true
  } ,
  email :{
    type  : String,
    required : true
  } ,
  date :{
      type : Date,
      default : Date.now
  } ,
  // profileImage: {
  //   type: Buffer,
  //   required: true
  // },
  // profileImageType: {
  //   type: String,
  //   required: true
  // },
  about: {
    type:String,
  },

});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);