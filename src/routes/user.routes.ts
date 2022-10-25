import {Router} from 'express';
import {
    authenticate,
    forgotPassword,
    resetPassword,
    signin,
    signup,
    updateProfile,
    updateProfileImages,
} from '../controllers/user.controller';
import {verifyToken} from '../middlewares/VerifyToken';

const userRouter = Router();
const profileRouter = Router({mergeParams: true})

userRouter.use('/profile/:profileId', profileRouter)

userRouter
    .get('/auth', verifyToken, authenticate)
    .post('/signup', signup)
    .post('/signin', signin)
    .post('/forgot-password', forgotPassword)
    .post('/reset-password', resetPassword);

profileRouter
    .put('/', verifyToken, updateProfile)
    .post('/images', verifyToken, updateProfileImages)

export default userRouter;
