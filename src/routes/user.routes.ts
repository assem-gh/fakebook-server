import { Router } from 'express';
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  authenticate,
} from '../controllers/user.controller';
import { verifyToken } from '../middlewares/VerifyToken';

const userRouter = Router();

userRouter
  .post('/auth', verifyToken, authenticate)
  .post('/signup', signup)
  .post('/signin', signin)
  .post('/forgot-password', forgotPassword)
  .post('/reset-password', resetPassword);

export default userRouter;
