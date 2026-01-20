[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![React](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![React](https://img.shields.io/badge/Typescript-4277c0?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![React](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3schools.com/css/)
[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![NPM](https://img.shields.io/badge/DEV-Jameshsu1125-9cf?style=for-the-badge)](https://www.npmjs.com/~jameshsu1125)

# Why use it?

Use it calculator timestamp for animation.

#### [Live Demo](https://jameshsu1125.github.io/lesca-enterframe/)

# Installation

```sh
npm install lesca-node-bunnycdn --save
```

## Usage

As a Node module:

```TS
import BunnyCDN from 'lesca-node-bunnycdn';
import multer from 'multer';
import express from 'express';

BunnyCDN.install({
  password: '7bcc3895-xxxx-xxxxxxxxxxxx-xxxx-xxxx', // storage key
  storageZone: 'npm-demo', // zone
  region: 'SG', // your region setting
  folderName: 'your-folder', // start with folder name
});

const uploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const app = express();
const port = 3000;

app.use(express.json());

app.post('/upload', uploadMulter.single('file'), async (req, res) => {
  const response = await BunnyCDN.upload({
    file: req.file,
    sharpConfig: { format: 'webp', quality: 80 },
  });
  if (response) res.json(response);
  else res.json({ res: false, message: 'Upload error' });
});

app.get('/list', async (_, res) => {
  const response = await BunnyCDN.list();

 if (response) res.json(response);
  else res.json({ res: false, message: 'List error' });
});

app.post('/delete', async (req, res) => {
  const response = await BunnyCDN.deleteFile({ href: req.body.href });

  if (response) res.json(response);
  else res.json({ res: false, message: 'Delete error' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

```

### Methods

| method                   |       description        | return |
| :----------------------- | :----------------------: | -----: |
| .**install**(options)    |     extend call func     |   void |
| .**upload**(options)     |  continue calling func   |   void |
| .**list**()              |    stop calling func     |   void |
| .**deleteFile**(options) | reverse to last function |   void |

### Features

- maintain if necessary
