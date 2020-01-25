import mongoose from "mongoose";
require("mongoose-type-url");

const Schema = mongoose.Schema;

const schoolSchema = new Schema(
  {
    name : { type:String, required:true, trim:true},
    image: {type:mongoose.SchemaTypes.Url},
    adminEmail: {type:String,required:true, trim:true},
    phone: {type:String,required:true,trim:true},
    address: {type:String,required:true,trim:true},
  },
  { timestamps:true}
);


const School = mongoose.model("School",schoolSchema);

export default School;

