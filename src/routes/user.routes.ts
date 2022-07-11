import { Router } from 'express';
import { signup } from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/signup', signup).post('/login');

export default userRouter;
