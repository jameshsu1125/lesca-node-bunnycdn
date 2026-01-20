import express from 'express';
import multer from 'multer';
import { deleteFile, install, list, upload } from '.';

install({
  password: '7bcc3895-199e-4545-9d9c4fc41248-858b-4002',
  storageZone: 'npm-demo',
  region: 'SG',
  folderName: 'folder',
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
  const response = await upload({ file: req.file, sharpConfig: { format: 'webp', quality: 80 } });
  if (response) res.json(response);
  else res.json({ res: false, message: 'Upload error' });
});

app.get('/list', async (_, res) => {
  const response = await list();
  if (response) res.json(response);
  else res.json({ res: false, message: 'List error' });
});

app.post('/delete', async (req, res) => {
  console.log(req.body);

  const response = await deleteFile({ href: req.body.href });

  if (response) res.json(response);
  else res.json({ res: false, message: 'Delete error' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
