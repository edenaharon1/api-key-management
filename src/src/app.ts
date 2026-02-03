import express from 'express';
import dotenv from 'dotenv';
import keysRouter from './routes/keys.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/accounts/:accountId/keys', keysRouter);

export default app;
