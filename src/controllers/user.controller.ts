import { NextFunction, Request, Response } from 'express';

import { NewUserSchema } from '../schemas/user.schema';
import userService from '../services/user.service';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUserData = NewUserSchema.parse(req.body);

    const newUser = await userService.createUser(newUserData);
    const jwtToken = userService.generateToken(newUser.id);

    res.status(200).send({ ...newUser, jwtToken });
  } catch (err) {
    next(err);
  }
};
