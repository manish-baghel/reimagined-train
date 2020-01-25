import mongoose from "mongoose";
// var mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    first_name : { type:String, required:true, trim:true},
    last_name : {type:String, required:true, trim:true},
    middle_name: {type:String, trim:true},
    email: {type:String,required:true, trim:true},
    password: {type:String,required:true,trim:true},
    phone: {type:String,required:true,trim:true},
    gender: {type:String,required:true,trim:true},
    role: {type:String,required:true,trim:true,enum:["donor","admin","schoolAdmin"],default:"donor"},
    school: {type:Schema.Types.ObjectId,default:undefined},
    verified: {type:Boolean,required:true,default:false}
  },
  { timestamps:true}
);


const User = mongoose.model("User",userSchema);

export default User;

