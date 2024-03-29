import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

import handleError from './middlewares/handleError';
import postRouter from './routes/post.routes';
import userRouter from './routes/user.routes';
import commentRouter from './routes/comment.routes';
import notificationRouter from './routes/notification.routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload({ parseNested: true }));
app.use(morgan('dev'));

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/notifications', notificationRouter);

app.use(handleError);

export default app;
