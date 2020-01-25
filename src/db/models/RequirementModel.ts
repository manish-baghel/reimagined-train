// import mongoose from "mongoose";
var mongoose = require('mongoose');
require("mongoose-type-url");

const Schema = mongoose.Schema;

const imageSchema = new Schema(
	{
		url: {type:mongoose.SchemaTypes.Url,required:true},
		tag: {type:String,trim:true}
	}

);

const requirementTypeSchema = new Schema(
	{
		title: {type:String,required:true,trim:true}
	}
);

const RequirementType = mongoose.model("RequirementType",requirementTypeSchema);

const requirementSchema = new Schema(
	{
		type: {type:Schema.Types.ObjectId,ref:"RequirementType"},
		imgs: [imageSchema],
		description: {type:String},
		requiredBy: {type:Schema.Types.ObjectId,ref:"User",required:true}
	},
	{timestamps:true}
);

const Requirement = mongoose.model("Requirement",requirementSchema);


export { RequirementType };
export default Requirement;

