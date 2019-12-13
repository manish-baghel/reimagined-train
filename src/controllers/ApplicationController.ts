import { Request, Response, NextFunction} from "express";
import cryptService from "../services/cryptService";
import * as path from "path";
import boom from "boom";
import User from "../db/models/UserModel";
import Session from "../db/models/SessionModel";
import { IToken } from "../middlewares/expressSession";
import AuthService from "../services/authService";



const login = async(req:Request, res:Response, next:NextFunction) => {
  let { qtype } = req.query;
  if(!qtype)
    qtype = "default";

  switch(qtype){
    case "token":
      const { token } = req.body;
      if(!token)
        return next(boom.unauthorized("Token not found"));
      try{
        const tokenData:any = await cryptService.verify(token);
        const sessionId:any = await tokenData.id;
        if(!sessionId)
          return next(boom.unauthorized("Session not found"));
        
        const session:any = await Session.findOne({_id:sessionId});
        if(!session)
          return next(boom.unauthorized("Session does not exist"));

        const user_id = session.user;
        const user:any = await User.findOne({_id:user_id});

        if(!user)
          return next(boom.unauthorized("User does not exist"));

        const {first_name,middle_name,last_name,gender,phone,email, dob} = user;
        const name = `${first_name} ${middle_name} ${last_name}`;
  
        const rn:Number = Math.floor(Math.random()*100000000) + Date.now();
        let newTokenData:IToken = {
          id: session.id,
          random: rn
        }

        const newToken = cryptService.sign(newTokenData);

        const data = {
          name:name,
          email:email,
          phone:phone,
          gender:gender,
          token:newToken
        }

        return res.json({status:true, data, msg:"Logged In Successfully"});
      }catch(err){
        console.log("==> Error in User Login Application Controller ", err);
        return next(boom.badImplementation(err));
      }

    case "default":
      const {email, pass } = req.body;
      const loggedInAt = Date.now();
      if(!email || !pass)
        return next(boom.unauthorized("E-mail address and Password are both required"));
      
      try{
        const authResponse:any = await AuthService.authWithEmailPass(email,pass);

        if(!authResponse)
          return next(boom.badRequest("Something went wrong while authenticating"));

        const user:any = authResponse;
        const newSession = await Session.createOne({user_id: user._id,loggedInAt});
        const sessionId:any = newSession._id;
        const rn = Math.floor(Math.random()*100000000 + Date.now());
        const {first_name,middle_name,last_name,gender,phone, dob} = user;
        const name = `${first_name} ${middle_name} ${last_name}`;
        const tokenData:IToken = {
          id: sessionId,
          random: rn
        }
        const token = cryptService.sign(tokenData);
        const data = {
          name: `${user.first_name} ${user.middle_name} ${user.last_name}`,
          gender:gender,
          dob:dob,
          email:email,
          phone:phone,
          token:token,
          role:user.role
        }
        return res.json({status:true, data, msg:"Logged in Successfully"});
      }catch(err){
        console.log("==> Error in User Login Application Controller[Mode:Default] ", err);
        return next(boom.badImplementation(err));
      }
  }
}

const applicationController = {
  login:login
}

export default applicationController;
