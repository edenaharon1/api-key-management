import { Request, Response } from 'express';
import { KeysService } from '../services/keys.service';

export const createKey = async (req: Request, res: Response) => {
  const { name } = req.body;
  const accountId = req.params.accountId as string;

  if (!name || name.length > 60) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  const apiKey = await KeysService.create(accountId, name);
  res.status(201).json(apiKey);
};

export const listKeys = async (req: Request, res: Response) => {
  const accountId = req.params.accountId as string;
  const keys = await KeysService.list(accountId);
  res.status(200).json(keys);
};

export const revokeKey = async (req: Request, res: Response) => {
  const id = req.params.id as string; // <-- כאן אנחנו אומרים ל-TypeScript שזה string

  if (!id) {
    return res.status(400).json({ error: 'Missing key ID' });
  }

  const key = await KeysService.revoke(id);
  if (!key) {
    return res.status(404).json({ error: 'Key not found' });
  }

  res.status(200).json(key);
};

