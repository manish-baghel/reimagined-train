import { Request, Response, NextFunction} from "express";
import { uploadImage } from "../services/awsServices/s3Services";
import Requirement from "../db/models/RequirementModel";
import { RequirementType } from "../db/models/RequirementModel";
import boom from "boom";



const getAllRequirement = async (req:Request, res:Response, next:NextFunction) => {
	try{
		const requirements = await Requirement.find({status:"active"}).populate("school").populate("requiredBy");
		return res.json({status:true,msg:"",data:requirements});
	}catch(err){
		console.log("Error in getAllRequirement[Requirement Controller]",err);
		return res.json({status:false,msg:"Error in loading requirements"});
	}
}

const getRequirementBySchoolId = async (req:Request, res:Response,next:NextFunction) => {
	if(!req.body)
		return next(boom.badRequest("Invalid request"));
	const {schoolId} = req.body;
	try{
		const requirements = await Requirement.find({school:schoolId});
		return res.json({status:true,msg:"",data:requirements});
	}catch(err){
		console.log("Error in getRequirementBySchoolId[Requirement Controller]",err);
		return res.json({status:false,msg:"Error in loading requirements"});
	}
}


const addRequirementTypes = async (req:Request, res:Response, next:NextFunction) => {
	if(!req.body)
		return next(boom.badRequest("Please enter requirement types"));
	if(req.session.data.user.role!="admin")
		return next(boom.unauthorized("You are not authorized to add requirement types"));
	const {reqTypes} = req.body;
	try{
		let reqTypesObj = [];
		for(let i=0;i<reqTypes.length;i++){
			let newReqType = await RequirementType.findOneAndUpdate({title:reqTypes[i]},{title:reqTypes[i]},{new:true,upsert:true});
			reqTypesObj[i] = newReqType;
		}
		return res.json({status:true,msg:"Types added succesfully",data:reqTypesObj});
	}catch(err){
		console.log("Error in addRequirementTypes[Requirement Controller]",err);
		return res.json({status:false,msg:"Error in adding requirement types"});
	}
}



const addRequirement = async (req:Request, res:Response,next:NextFunction) => {
	console.log("here000");
	if(!req.body)
		return next(boom.badRequest("Please enter all required fields"));
	const { type, description, quantity} = req.body;
	const files = req.files;
	const requiredBy = req.session.user_id;
	console.log("here001");
	if(!files)
		return next(boom.badRequest("Please upload atleast 1 Image"));
	console.log("here002");
	if(!type)
		return next(boom.badRequest("Please select requirement type"));
	console.log("here003");
	if(!quantity)
		return next(boom.badRequest("Please enter quantity of the requirement"));
	console.log("here004");
	if(!description)
		return next(boom.badRequest("Please enter description of the requirement"));
	try{
		console.log("here");
		const userRole = req.session.data.user.role;
		if(userRole!="schoolAdmin")
			return next(boom.unauthorized("You are not authorized to add requirements"));
		const schoolId = req.session.data.user.school;
		if(!schoolId)
			return next(boom.unauthorized("You are not linked with any school"));
		let imgObjects = [];
		for(let i=0;i<files.length;i++){
			let imgUrl = await uploadImage({file_path:files[i].path});
			let imgObject = {
				url:imgUrl,
				tag: files[i].originalname
			}
			imgObjects[i] = imgObject;
		}
		const newRequirement = new Requirement({type,description,imgs:imgObjects,requiredBy,quantity,school:schoolId});
		const newRequirementDoc:any = await newRequirement.save();
		return res.json({status:true,msg:"Requirement added succesfully",data:newRequirementDoc})
	}catch(err){
		console.log("==============> Error in addRequirement [RequirementsController.ts]",err);
		return next(boom.badImplementation("Error in adding requirement"));
	}
}

const delRequirement = async(req:Request, res:Response,next:NextFunction) => {
	if(!req.body)
		return next(boom.badRequest("Please select the requirement you want to delete"));
	const {reqId} = req.body;
	if(!reqId)
		return next(boom.badRequest("Please select the requirement you want to delete[reqId not found]"));
	try{
		const query = Requirement.findOneAndRemove({_id:reqId});
		const remReqModel = await query.exec();
		return res.json({status:true,msg:"Requirement removed Succesfully",data:remReqModel});
	}catch(err){
		return res.json({status:false,msg:"Error in deleting requirement"});
	}

}

const closeRequirement = async (req:Request,res:Response,next:NextFunction) => {
	if(!req.body)
		return next(boom.badRequest("Invalid Request"));
	const {reqId} = req.body;
	if(!reqId)
		return next(boom.badRequest("Please select the requirement you want to update"));
	try{
		const requirement = await Requirement.findOneAndUpdate({_id:reqId},{_id:reqId,$set:{status:"closed"}},{new:true});
		return res.json({status:true,msg:"Requirement closed",data:requirement});
	}catch(err){
		return res.json({status:false,msg:"Error in closing Requirement"});
	}
}

const updateRequirementQuantity = async(req:Request,res:Response,next:NextFunction) => {
	if(!req.body)
		return next(boom.badRequest("Invalid Request"));
	const {reqId,newQuantity} = req.body;
	if(!reqId)
		return next(boom.badRequest("Please select the requirement you want to update"));
	if(!newQuantity)
		return next(boom.badRequest("Please enter new quantity of the requirement"));
	try{
		const requirement = await Requirement.findOneAndUpdate({_id:reqId},{_id:reqId,$set:{quantity:newQuantity}},{new:true});
		return res.json({status:true,msg:"Requirement quantity updated",data:requirement});
	}catch(err){
		return res.json({status:false,msg:"Error in updating Requirement"});
	}
}


const requirementController = {
	addRequirement:addRequirement,
	delRequirement:delRequirement,
	closeRequirement:closeRequirement,
	updateRequirementQuantity:updateRequirementQuantity,
	getAllRequirements:getAllRequirement,
	getRequirementBySchoolId:getRequirementBySchoolId,
	addRequirementTypes:addRequirementTypes
}

export default requirementController;