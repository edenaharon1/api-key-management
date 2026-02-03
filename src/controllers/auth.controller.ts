import { Request, Response } from 'express';
import { KeysService } from '../services/keys.service';

export const verifyKey = async (req: Request, res: Response) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey) return res.status(401).json({ error: 'API key required' });

  const result = await KeysService.verify(apiKey);
  if (!result) return res.status(401).json({ error: 'Invalid or revoked API key' });

  res.status(200).json(result);
};
