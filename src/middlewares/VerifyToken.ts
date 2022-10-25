import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '../utils/HttpError';
import { serverConfig } from '../config';
import userService from '../services/user.service';

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) throw (new HttpError(401, 'Unauthorized, Access is denied '));

    const decoded = jwt.verify(token , serverConfig.JWT_SECRET) as jwt.JwtPayload
    const user = await userService.findUser(decoded.id);
    const { id, userName, email, profile } = user;
    req.user = { id, userName, email, profile };
    next();
  } catch (err) {
    next(err);
  }
};
