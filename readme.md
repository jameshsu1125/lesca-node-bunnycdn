[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![React](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![React](https://img.shields.io/badge/Typescript-4277c0?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![React](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3schools.com/css/)
[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)

# Why use it?

Use it calculator timestamp for animation.

# Installation

```sh
npm install lesca-node-bunnycdn --save
```

## Usage

# Lesca Node BunnyCDN

A Node.js client library for BunnyCDN storage operations with TypeScript support.

## Installation

```bash
npm install lesca-node-bunnycdn
```

## Usage

### Basic Usage with Constructor

```typescript
import BunnyCDN from 'lesca-node-bunnycdn';

// Initialize client with configuration
const client = new BunnyCDN({
  storageZone: 'your-storage-zone',
  password: 'your-password',
  region: 'SG', // optional, defaults to 'SG'
  folderName: 'uploads', // optional, defaults to ''
});

// Upload a file
const uploadResult = await client.upload({
  buffer: yourBuffer, // or file: yourFile
});

// List files
const listResult = await client.list();

// Delete a file
const deleteResult = await client.deleteFile({
  ObjectName: 'filename.webp',
  // or href: 'https://your-zone.b-cdn.net/uploads/filename.webp'
});
```

### Configuration Parameters

| Parameter     | Type   | Required | Default | Description                                         |
| ------------- | ------ | -------- | ------- | --------------------------------------------------- |
| `storageZone` | string | Yes      | -       | Your BunnyCDN storage zone name                     |
| `password`    | string | Yes      | -       | Your BunnyCDN storage password                      |
| `region`      | string | No       | 'SG'    | Storage region (e.g., 'SG', 'NY', 'LA', 'UK', 'DE') |
| `folderName`  | string | No       | ''      | Folder path within the storage zone                 |

## API Reference

### Constructor

```typescript
new BunnyCDNClient({
  storageZone: string;
  password: string;
  region?: string;
  folderName?: string;
})
```

### upload(params)

Uploads a file to BunnyCDN storage.

**Parameters:**

- `file`: Express multer file object (optional)
- `buffer`: Buffer containing file data (optional)

**Returns:**

```typescript
Promise<{
  res: boolean;
  message: string;
  url?: string;
  error?: any;
}>;
```

**Example:**

```typescript
const result = await client.upload({
  buffer: fs.readFileSync('image.jpg'),
});

if (result.res) {
  console.log('Upload successful:', result.url);
} else {
  console.error('Upload failed:', result.message);
}
```

### list()

Lists all files in the configured storage zone and folder.

**Returns:**

```typescript
Promise<{
  res: boolean;
  message: string;
  files?: File[];
}>;
```

**Example:**

```typescript
const result = await client.list();

if (result.res && result.files) {
  result.files.forEach((file) => {
    console.log('File:', file.ObjectName, 'URL:', file.Url);
  });
}
```

### deleteFile(params)

Deletes a file from BunnyCDN storage.

**Parameters:**

- `ObjectName`: File name to delete (optional)
- `href`: Full URL of the file to delete (optional)

**Returns:**

```typescript
Promise<{
  res: boolean;
  message: string;
}>;
```

**Example:**

```typescript
// Delete by object name
const result = await client.deleteFile({
  ObjectName: 'image.webp',
});

// Or delete by URL
const result = await client.deleteFile({
  href: 'https://your-zone.b-cdn.net/uploads/image.webp',
});
```

### Features

- maintain if necessary
