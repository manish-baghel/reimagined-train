import * as jwt from "./jwtService";
import * as bcrypt from "bcryptjs";
import { promisify } from "util";
import fs from "fs";
// import * as obj from "../app";
import path from "path";
// const appText:any = fs.readFile(path.resolve("../app.ts"),(err,t) => {if(err) console.log(err); else console.log(t.toString())});
// console.log(appText);

// const env = app.env;
import getEnv from '../sessionVariable';
console.log(getEnv);
const environment = process.env.ENV;
const env = getEnv(environment);

const SESSION_SECRET = env.SESSION_SECRET;
const SALT_ROUNDS = env.SALT_ROUNDS;

const _hash = async (pass:string, cb:Function) => {
  try{
    console.log(pass);
    const hash = promisify(bcrypt.hash);
    const hashed = await hash(pass, SALT_ROUNDS);
    console.log(hashed);
    return cb(null,hashed);
  }catch(err){
    console.log("==> Error in _hash cryptService: ", err);
    return cb(err,null);
  }
}

const _verify = async (token:string,cb:Function) => {
  try{
    const tokenData:any = await jwt.verify(token, SESSION_SECRET);
    return cb(null,{id: tokenData.id});
  }catch(err){
    console.log("==> Error in _verify cryptService: ", err);
    return cb(err,null);
  }
}

const _compare = async (str: string, hash: string, cb: Function) => {
  try {
    const isEqual = await bcrypt.compare(str, hash);
    return cb(null, isEqual);
  } catch (err) {
    console.log("==> Error in _compare cryptService: ", err);
    return cb(err, null);
  }
}

const _sign = (payload: any) => {
    return jwt.sign(payload, SESSION_SECRET);
}

const cryptService = {
  hash: promisify(_hash),
  verify : promisify(_verify),
  compare : promisify(_compare),
  sign: _sign
}

export default cryptService;
