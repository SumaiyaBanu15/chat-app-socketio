const mongoose = require("mongoose");

const validateEmail = (e)=>{
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(e); 
}

const userSchema = new mongoose.Schema({
  username: {
     type: String, 
     required: true, 
     minlength: 3,
     maxlength: 20,
     unique: true, 
    },
  email: { 
    type: String, 
    required: true, 
    maxlength: 30, 
    unique: true,
    validate: [validateEmail, "Please fill a valid email address!" ] 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6, 
  },
  isAvatarImgSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
},{
// collection :  "Users",
versionKey : false
}
);

module.exports = mongoose.model("Users", userSchema);