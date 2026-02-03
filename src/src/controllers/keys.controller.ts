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
