import { Request, Response, NextFunction} from "express";
import { uploadImage } from "../services/awsServices/s3Services";
import Requirement from "../db/models/RequirementModel";
import boom from "boom";



const addRequirement = async (req:Request, res:Response,next:NextFunction) => {
	if(!req.body)
		return next(boom.badRequest("Please enter all required fields"));
	const { type, description} = req.body;
	const files = req.files;
	const requiredBy = req.session.user_id;
	if(!files)
		return next(boom.badRequest("Please upload atleast 1 Image"));
	if(!type)
		return next(boom.badRequest("Please select requirement type"));
	if(!description)
		return next(boom.badRequest("Please enter description of the requirement"));

	try{
		let imgObjects = {};
		for(let i=0;i<files.length;i++){
			let imgUrl = await uploadImage({file_path:files[i].path});
			let imgObject = {
				url:imgUrl,
				tag: files[i].originalname
			}
			imgObjects[i] = imgObject;
		}
		const newRequirement = new Requirement({type,description,imgs:imgObjects,requiredBy});
		const newRequirementDoc:any = await newRequirement.save();
		return res.json({status:true,msg:"Requirement added succesfully",data:JSON.stringify(newRequirementDoc)})
	}catch(err){
		console.log("==============> Error in addRequirement [RequirementsController.ts]",err.msg);
		return res.json({status:false,msg:"Error in adding requirement"});
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


const requirementController = {
	addRequirement:addRequirement,
	delRequirement:delRequirement
}

export default requirementController;