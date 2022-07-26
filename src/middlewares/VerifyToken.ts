import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '../utils/HttpError';
import { server } from '../config';
import { userRepository } from '../services/user.service';

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) throw new HttpError(401, 'Access Denied');

    const { id } = jwt.verify(token, server.JWT_SECRET) as { id: string };
    const verifiedUser = await userRepository.findOneBy({ id });
    if (!verifiedUser) throw new HttpError(401, 'User Not  found');

    req.user = { id: verifiedUser.id };
    next();
  } catch (err) {
    next(err);
  }
};
