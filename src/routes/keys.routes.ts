import { Router } from 'express';
import { createKey, listKeys } from '../controllers/keys.controller';

const router = Router({ mergeParams: true });

router.post('/', createKey);
router.get('/', listKeys);

export default router;
