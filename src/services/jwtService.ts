import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const verify = promisify(jwt.verify);
export const sign = jwt.sign;
