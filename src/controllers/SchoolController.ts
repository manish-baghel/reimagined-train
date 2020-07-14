import { Request, Response, NextFunction} from "express";
import cryptService from "../services/cryptService";
import * as path from "path";
import boom from "boom";
import User from "../db/models/UserModel";
import School from "../db/models/SchoolModel";
import Session from "../db/models/SessionModel";
import { IToken } from "../middlewares/expressSession";
import AuthService from "../services/authService";
import validator from "../utils/validator";
import env from "../env";

const registerSchool = async (req:Request, res:Response, next:NextFunction) => {
	if(!req.body)
		return next(boom.unauthorized("Please enter all required fields"));
    const admin_id = req.session.user_id;
    if(!admin_id)
        return next(boom.badRequest("Please login before adding user"));
    try{
        let user_from_db = await User.findOne({_id:admin_id});
        if(!user_from_db)
            return next(boom.unauthorized("Please login with valid credentials"));
        if(user_from_db.role!="admin")
            return next(boom.unauthorized("You are not authorized to perform this operation"));
        const {school_name,school_addr,school_admin,phone} = req.body;
        const isEmailValid = validator.validateEmail(school_admin);
        if(!isEmailValid)
            return next(boom.badRequest("Invalid Email Address"));
        const schoolAdmin = await User.findOne({email:school_admin});
        if(!schoolAdmin)
            return next(boom.badRequest(`Please ask the person with email address - ${schoolAdmin} to register`));
        const role = "schoolAdmin";
        const newSchoolModel = new School({name:school_name,address:school_addr,phone,adminEmail:school_admin});
        const newSchool:any = await newSchoolModel.save();
        const updatedSchoolAdmin = await User.findOneAndUpdate({email:school_admin},{email:school_admin,$set:{role:role,school:newSchool._id}},{new:true});
        return res.json({status:true,msg:"School added succesfully",data:newSchool});
    }catch(err){
    	console.log("==> Error in registerSchool [SchoolController]", err);
    	return res.json({status:false,msg:"Something Went wrong",data:null});
    }
}

const addSchoolImage = async(req:Request,res:Response,next:NextFunction) => {
    if(!req.file)
        return next(boom.badRequest("Please upload Image from your computer"));
    const user_id = req.session.user_id;
    if(req.session.data.user.role!="schoolAdmin")
        return next(boom.unauthorized("You are not authorized to perform this operation"));
    try{
        const file = req.file;
        let imgUrl = `${env.SERVER_URL}:${env.PORT}/public/uploads/${file.filename}`;
        const updatedSchool = await School.findOneAndUpdate({_id:req.session.data.user.school},{_id:req.session.data.user.school,image:imgUrl},{new:true});
        return res.json({status:true,msg:"Image Uploaded succesfully",data:updatedSchool});
    }catch(err){
        console.log("Error in addSchoolImage[School Controller] ",err);
        return res.json({status:false,msg:"Error in uploading image"});
    }
}


const schoolController = {
  register:registerSchool,
  addSchoolImage:addSchoolImage
}

export default schoolController;
