const mongoose = require('mongoose');
const Post  = new mongoose.Schema({
  title :{
      type  : String,
      required : true
  } ,
  content :{
    type  : String,
    required : true
  } ,
  date :{
      type : Date,
      default : Date.now
  } ,
//   postImage: {
//     type: Buffer,
//     required: true
//   },
//   postImageType: {
//     type: String,
//     required: true
//   },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }

});


module.exports = mongoose.model('Post',Post);