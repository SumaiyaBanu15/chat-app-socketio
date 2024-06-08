const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");

module.exports.signUp = async (req,res,next) => {
 try {
    const { username, email, password } = req.body;

    if(!username || !email || !password){
      return res.json({ msg:"All fields are required", status: false });
    }

    if(username.length < 3 || username.length > 20){
      return res.json({msg: "Username must be between 3 and 20 characters", status:false});
    }

  const usernameCheck = await User.findOne({ username });
  if(usernameCheck){
    return res.json({ msg: `User with this ${username} name is already exits`, status: false});
  }

  const emailCheck = await User.findOne({ email });
  if(emailCheck){
    return res.json({ msg: `User with this ${email} email Id already exists`, status:false});
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    password : hashPassword,
  })
  delete user.password;
  // console.log("User created: ", user)
  return res.json({ status: true, user });
 } catch (ex) {
    console.log("Error during user creation: ", ex)
    next(ex);
 } 
};

module.exports.login = async (req,res,next) => {
  try {
     const { username, password } = req.body;
 
   const usernameCheck = await User.findOne({ username });
   if(!usernameCheck){
     return res.json({ msg: "Incorrect username", status:false});
   }
   const isPassword = await bcrypt.compare(password, usernameCheck.password);
   if(!isPassword){
    return res.json({msg: "Incorrect Password", status:false});
   }
   delete usernameCheck.password;
   return res.json({ status: true, user: usernameCheck });
  } catch (ex) {
     next(ex);
  } 
 };

module.exports.setAvatar = async(req, res, next) =>{
  try{
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImgSet: true,
      avatarImage,
    })
    return res.json({
      isSet: userData.isAvatarImgSet, image: userData.avatarImage})
  }
  catch (ex){
      next(ex);
  }

};


module.exports.getAllUsers = async(req, res, next) =>{ 
  try{
    const users = await User.find({_id: { $ne: req.params.id }}).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  }
  catch (ex){
    next(ex);
  }
};