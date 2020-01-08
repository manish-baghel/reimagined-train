import { Request, NextFunction, Response } from "express";
import boom from "boom";
import User from "../../db/models/UserModel";

const identification = async (req:Request, res:Response, next:NextFunction) => {
  if(!req.session)
    return next(boom.unauthorized("Session Not Found"));
  
  const userId = req.session.user;
  console.log(req.session);
  
  if (!userId)
    return next(boom.unauthorized("user id not found"));

  try{
    const user:any = await User.findOne({_id:userId});
    if(!user)
      return next(boom.unauthorized("User Not Found"));
    if(req.session.data && user.role.title!=req.session.data.user.role.title)
      return next(boom.unauthorized("Stop F***in around"));
    req.session.data = {}
    req.session.data.user = {
      phone: user.phone,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name:user.last_name,
    }

    return next();
  }catch(err){
    console.log("==> Error in Identif. Middleware :", err);
    return next(boom.badImplementation(err));
  }
}

export default identification;
