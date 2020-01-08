// import mongoose from "mongoose";
var mongoose = require('mongoose');
require("mongoose-type-url");

const Schema = mongoose.Schema;

const imageSchema = new Schema(
	{
		url: {type:mongoose.SchemaTypes.Url,required:true},
		tag: {type:String}
	}

);

const requirementSchema = new Schema(
	{
		type:{type:String, enum: ['chair', 'table', 'fan', 'blackboard', 'whiteboard', 'books', 'sports-equipment', 'stationary', 'computer-accesories']},
		imgs: [imageSchema],
		description: {type:String},
		requestor: {type:Schema.Types.ObjectId,ref="User",required:true}
	},
	{timestamps:true}
);

const Requirement = mongoose.model("Requirement",requirementSchema);

export default Requirement;

