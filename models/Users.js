const {
    Schema,
    model
  } = require("mongoose");
  
  const MyUser = new Schema({
    name: {
      type: String,
      required: true,
      maxlength: 50
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
    ,
    password:{
        type:String,
        required:true,
        minlength: 8
    },
    isVerified:{
      type:Boolean,
    },
    // verificationCode:String,
    // confirmPassword:{
    //     type:String,
    //     required:true
    // }
    // ,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
  ,
  // {timestamps:true}
);
  
  const UserModel = model("User", MyUser)
  
  module.exports = UserModel