import { NextFunction, Request, Response } from 'express';

import { LoginUserSchema, NewUserSchema } from '../schemas/user.schema';
import mailService, { EmailTemplate } from '../services/mail.service';
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
    const url = userService.generateVerificationUrl(newUser.id);

    await mailService.sendEmail(
      EmailTemplate.ACCOUNT_VERIFICATION,
      newUser.email,
      url
    );

    res.status(200).send({ ...newUser, jwtToken });
  } catch (err) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const credentials = LoginUserSchema.parse(req.body);

    const user = await userService.login(credentials);
    const jwtToken = userService.generateToken(user.id);

    res.status(200).send({ ...user, jwtToken });
  } catch (err) {
    next(err);
  }
};
