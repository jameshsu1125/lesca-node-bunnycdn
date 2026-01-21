import express from 'express';
import multer from 'multer';
import BunnyCDN from '.';
import dotenv from 'dotenv';
import sharp from 'sharp';

dotenv.config({ path: '.env.local' });

const bunnyCDN = new BunnyCDN({
  password: process.env.VITE_PASSWORD || 'unset',
  storageZone: 'npm-demo',
  region: 'SG',
  folderName: process.env.VITE_FOLDER_NAME || '',
});

const app = express();
const port = 3000;

// 添加 JSON 解析中间件
app.use(express.json());

// 添加 CORS 支持
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const uploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post('/upload', uploadMulter.single('file'), async (req, res) => {
  const sharpConfig: { format?: 'jpeg' | 'png' | 'webp'; quality?: number; width?: number } = {
    format: 'webp',
    quality: 80,
    width: 720,
  };

  const buffer = await sharp(req.file?.buffer)
    .resize({
      width: sharpConfig.width,
      withoutEnlargement: true,
    })
    .toFormat(sharpConfig.format || 'webp', { quality: sharpConfig.quality || 80 })
    .toBuffer();

  const response = await bunnyCDN.upload({
    buffer,
  });
  if (response) res.json(response);
  else res.json({ res: false, message: 'Upload error' });
});

app.get('/list', async (_, res) => {
  const response = await bunnyCDN.list();
  if (response) res.json(response);
  else res.json({ res: false, message: 'List error' });
});

app.post('/delete', async (req, res) => {
  const response = await bunnyCDN.deleteFile({ href: req.body.href });
  if (response) res.json(response);
  else res.json({ res: false, message: 'Delete error' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
