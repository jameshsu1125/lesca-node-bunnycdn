import { Request, Response } from 'express';

export type Status = 'loading' | 'loaded' | 'error';

export type SharpConfig = {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
};

export type Params = {
  req: Request;
  res: Response;
};

export type InstallParams = {
  password: string;
  storageZone?: string;
  region?: string;
  folderName?: string;
};

export type UploadParams = {
  file?: Express.Multer.File;
  sharpConfig: SharpConfig;
};

export type LegacyUploadParams = {
  req: Request;
  res: Response;
  sharpConfig: SharpConfig;
};
