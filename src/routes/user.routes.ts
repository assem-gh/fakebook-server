import { Router } from 'express';

const userRouter = Router();

userRouter.post('/signup').post('/login');

export default userRouter;
