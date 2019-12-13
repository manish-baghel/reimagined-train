import User from "../db/models/UserModel";
import * as internalEventTypes from '../constants/internalEventConstants';
import crypt from './cryptService';
import { promisify } from 'util';
import { hashSync } from 'bcryptjs';


async function _authenticateWithEmailPass(email: string, pass: string, cb: Function) {
  if (!email || !pass) {
    return cb(new Error(internalEventTypes.INVALID_PROPS));
  }
  console.log('inside auth with email pass');
  try {

    const user: any = await User.findOne({email:email});

    if (!user) {
      return cb(new Error(internalEventTypes.USER_NOT_FOUND), null);
    }
    //console.log("user from get user by email", user);
    const passHashed = user.password;

    const isEqual: any = await crypt.compare(pass, passHashed);
    if (!isEqual) {
      return cb(new Error(internalEventTypes.PASSWORD_NOT_VALID), null);
    }

    return cb(null, user);
  } catch (err) {
    console.log('inside catch ', err);
    return cb(err, null);
  }
}


async function _findUserWithEmail(email: string, cb: Function) {
  if (!email) {
    return cb(new Error(internalEventTypes.INVALID_PROPS));
  }
  console.log('inside auth on forget password');
  try {

    const user: any = await User.findOne({email:email});
    if (!user) {
      return cb(new Error(internalEventTypes.USER_NOT_FOUND), null);
    }
    return cb(null, user);
  } catch (err) {
    console.log('inside catch ', err);
    return cb(err, null);
  }
}

const authenticationService = {
  authWithEmailPass: promisify(_authenticateWithEmailPass),
  findUserWithEmail: promisify(_findUserWithEmail)
}
export default authenticationService;