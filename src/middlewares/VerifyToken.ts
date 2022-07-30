import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '../utils/HttpError';
import { serverConfig } from '../config';
import { userRepository } from '../services/user.service';

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) throw new HttpError(401, 'Unauthorized, Access is denied ');

    const { id } = jwt.verify(token, serverConfig.JWT_SECRET) as { id: string };
    const verifiedUser = await userRepository.findOneBy({ id });
    if (!verifiedUser) throw new HttpError(401, 'User Not  found');

    req.user = { id: verifiedUser.id };
    next();
  } catch (err) {
    next(new HttpError(401, 'Unauthorized, Access is denied'));
  }
};
