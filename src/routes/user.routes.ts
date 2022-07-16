import { Router } from 'express';
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
} from '../controllers/user.controller';

const userRouter = Router();

userRouter
  .post('/signup', signup)
  .post('/signin', signin)
  .post('/forgot-password', forgotPassword)
  .post('/reset-password', resetPassword);

export default userRouter;
