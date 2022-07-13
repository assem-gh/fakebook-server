import { Router } from 'express';
import { signup, signin } from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/signup', signup).post('/signin', signin);

export default userRouter;
