import { Router } from 'express';
import { createKey, listKeys, revokeKey } from '../controllers/keys.controller';

const router = Router({ mergeParams: true });

router.post('/', createKey);
router.get('/', listKeys);
router.post('/:id/revoke', revokeKey)

export default router;
