const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const User  = new mongoose.Schema({
  name:{
    type: String,
    required:true,
  },
  username :{
      type  : String,
      required : true,
      unique:true
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
    default:"User has not written about him."
  },

});

User.plugin(passportLocalMongoose);



module.exports = mongoose.model('User',User);