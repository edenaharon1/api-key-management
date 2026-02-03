import express from 'express';
import dotenv from 'dotenv';
import keysRouter from './routes/keys.routes';
import authRouter from './routes/auth.routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/accounts/:accountId/keys', keysRouter);

export default app;
