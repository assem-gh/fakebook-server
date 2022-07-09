import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './routes/user.routes';
import handleError from './middlewares/handleError';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/users', userRouter);

app.use(handleError);

export default app;
