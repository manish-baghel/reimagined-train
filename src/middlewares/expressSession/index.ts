import {Request, Response, NextFunction} from "express";
import boom from "boom";
import { env } from "../../app";
import Session from "../../db/models/SessionModel";
import cryptService from "../../services/cryptService";

export interface IToken {
  id: number | string,
  random : Number | string,
  data?: any
}

const expressSession = async (req:Request, res:Response, next:NextFunction) => {
  const headerToken:any = req.headers[env.AUTH_TOKEN_TITLE] || req.header[env.ADMIN_AUTH_TOKEN_TITLE];
  if(!headerToken)
    return next(boom.unauthorized("token not found"));
  try{
    const tokenData:any = await cryptService.verify(headerToken);
    const session:any = await Session.findOne({_id:tokenData.id}); 
    if(!session)
      return next(boom.unauthorized("Session does not exist"));

    req.session = session;
    return next();
  }catch(err){
    console.log("==> Error in expressSession: ", err);
    return next(err);
  }
}

export default expressSession;
