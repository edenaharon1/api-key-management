import { Router } from 'express';
import { verifyKey } from '../controllers/auth.controller';

const router = Router();

router.get('/verify', verifyKey);

export default router;
