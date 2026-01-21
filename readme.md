[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![React](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![React](https://img.shields.io/badge/Typescript-4277c0?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![React](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3schools.com/css/)
[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![BunnyCDN](https://img.shields.io/badge/BunnyCDN-FF6900?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K&logoColor=white)](https://bunny.net/)

# Lesca Node BunnyCDN

A Node.js client library for BunnyCDN storage operations with TypeScript support. Perfect for file uploads, management, and integration with serverless functions like Netlify Functions.

## Why use it?

- 🚀 **Easy to use** - Simple API for BunnyCDN storage operations
- 🔧 **TypeScript support** - Full type definitions included
- 🌍 **Multi-region support** - Works with all BunnyCDN storage regions
- 🔒 **Environment variable support** - Perfect for serverless environments
- 📁 **Folder organization** - Organize files in custom folder structures
- ⚡ **Lightweight** - No unnecessary dependencies

## Installation

```bash
npm install lesca-node-bunnycdn --save
```

## Usage

### Method 1: Using Environment Variables (Recommended for Netlify Functions)

Set environment variables in your Netlify dashboard or `.env` file:

```bash
BUNNY_STORAGE_ZONE=your-storage-zone
BUNNY_PASSWORD=your-password
BUNNY_REGION=SG
BUNNY_FOLDER_NAME=uploads
```

```typescript
import BunnyCDN from 'lesca-node-bunnycdn';

// Upload a file (uses environment variables)
const uploadResult = await BunnyCDN.upload({
  buffer: yourBuffer, // or file: yourFile
});

// List files
const listResult = await BunnyCDN.list();

// Delete a file
const deleteResult = await BunnyCDN.deleteFile({
  ObjectName: 'filename.webp',
});
```

### Method 2: Using install() Function

```typescript
import BunnyCDN from 'lesca-node-bunnycdn';

// Configure once
BunnyCDN.install({
  storageZone: 'your-storage-zone',
  password: 'your-password',
  region: 'SG', // optional
  folderName: 'uploads', // optional
});

// Use throughout your application
const uploadResult = await BunnyCDN.upload({ buffer: yourBuffer });
const listResult = await BunnyCDN.list();
```

### Method 3: Passing Configuration Parameters

```typescript
import { upload, list, deleteFile } from 'lesca-node-bunnycdn';

// Pass configuration with each call
const uploadResult = await upload({
  buffer: yourBuffer,
  storageZone: 'your-storage-zone',
  password: 'your-password',
  region: 'SG',
  folderName: 'uploads',
});
```

## Configuration Parameters

| Parameter     | Type   | Required | Default | Description                                         |
| ------------- | ------ | -------- | ------- | --------------------------------------------------- |
| `storageZone` | string | Yes      | -       | Your BunnyCDN storage zone name                     |
| `password`    | string | Yes      | -       | Your BunnyCDN storage password                      |
| `region`      | string | No       | 'SG'    | Storage region (e.g., 'SG', 'NY', 'LA', 'UK', 'DE') |
| `folderName`  | string | No       | ''      | Folder path within the storage zone                 |

## API Reference

### upload(params)

Uploads a file to BunnyCDN storage.

**Parameters:**

- `file`: Express multer file object (optional)
- `buffer`: Buffer containing file data (optional)
- Configuration parameters (optional - will override environment variables)

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
const result = await BunnyCDN.upload({
  buffer: fs.readFileSync('image.jpg'),
});

if (result.res) {
  console.log('Upload successful:', result.url);
} else {
  console.error('Upload failed:', result.message);
}
```

### list(configOverrides?)

Lists all files in the configured storage zone and folder.

**Parameters:**

- `configOverrides`: Configuration parameters (optional)

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
const result = await BunnyCDN.list();

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
- Configuration parameters (optional)

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
const result = await BunnyCDN.deleteFile({
  ObjectName: 'image.webp',
});

// Or delete by URL
const result = await BunnyCDN.deleteFile({
  href: 'https://your-zone.b-cdn.net/uploads/image.webp',
});
```

### install(params)

Sets up default configuration for the library.

**Parameters:**

- `storageZone`: Your BunnyCDN storage zone name
- `password`: Your BunnyCDN storage password
- `region`: Storage region (optional)
- `folderName`: Folder path within storage zone (optional)

**Example:**

```typescript
BunnyCDN.install({
  storageZone: 'my-zone',
  password: 'my-password',
  region: 'SG',
  folderName: 'uploads',
});
```

## TypeScript Support

This library includes full TypeScript definitions. Import types as needed:

```typescript
import BunnyCDN from 'lesca-node-bunnycdn';
import type { InstallParams, UploadParams, File } from 'lesca-node-bunnycdn/dist/type';
```

## Error Handling

All methods return promises that resolve to objects with a `res` boolean field indicating success or failure:

```typescript
const result = await BunnyCDN.upload({ buffer: yourBuffer });

if (result.res) {
  // Success
  console.log(result.message, result.url);
} else {
  // Error
  console.error(result.message, result.error);
}
```

## Netlify Functions Example

```typescript
// netlify/functions/upload.ts
import BunnyCDN from 'lesca-node-bunnycdn';

export const handler = async (event, context) => {
  try {
    const buffer = Buffer.from(event.body, 'base64');

    // Configuration will be read from environment variables
    const result = await BunnyCDN.upload({ buffer });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Upload failed' }),
    };
  }
};
```

## Supported Regions

- `SG` - Singapore (default)
- `NY` - New York
- `LA` - Los Angeles
- `UK` - United Kingdom
- `DE` - Germany

## Features

- ✅ Upload files to BunnyCDN storage
- ✅ List files in storage zone
- ✅ Delete files from storage
- ✅ Support for different regions
- ✅ Folder organization
- ✅ Full TypeScript support
- ✅ Environment variable configuration
- ✅ Automatic file extension handling (.webp)
- ✅ UUID-based filename generation
- ✅ Perfect for serverless functions

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### Features

- maintain if necessary
