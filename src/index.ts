import { randomUUID } from 'crypto';
import { File, InstallParams, UploadParams } from './type';

// 從環境變數或參數中取得配置
const getConfig = (overrides: Partial<InstallParams> = {}) => {
  return {
    region: overrides.region || process.env.BUNNY_REGION || 'SG',
    baseHostName: 'storage.bunnycdn.com',
    folderName: overrides.folderName || process.env.BUNNY_FOLDER_NAME || '',
    storageZone: overrides.storageZone || process.env.BUNNY_STORAGE_ZONE || 'unset',
    password: overrides.password || process.env.BUNNY_PASSWORD || 'unset',
  };
};

export const install = ({ storageZone, password, region, folderName }: InstallParams) => {
  // 設定環境變數（僅在 Node.js 環境中有效，Netlify Functions 需要在儀表板設定）
  if (storageZone) process.env.BUNNY_STORAGE_ZONE = storageZone;
  if (password) process.env.BUNNY_PASSWORD = password;
  if (region) process.env.BUNNY_REGION = region;
  if (folderName) process.env.BUNNY_FOLDER_NAME = folderName;
};

export const upload = async ({
  file,
  buffer,
  ...configOverrides
}: UploadParams & Partial<InstallParams>) => {
  return new Promise<{ res: boolean; message: string; url?: string; error?: any }>(
    async (resolve, reject) => {
      try {
        if (!buffer && !file) reject({ res: false, message: 'No file uploaded' });

        const config = getConfig(configOverrides);
        const filename = `${randomUUID()}.${'webp'}`;
        const len = buffer ? buffer.length : file!.buffer.length;

        const options = {
          method: 'PUT',
          hostname: config.region ? `${config.region}.${config.baseHostName}` : config.baseHostName,
          port: 443,
          path: `/${config.storageZone}/${config.folderName}/${filename}`,
          headers: {
            AccessKey: config.password,
            'Content-Type': 'application/octet-stream',
            'Content-Length': len.toString(),
          },
        };

        const res = await fetch(`https://${options.hostname}${options.path}`, {
          method: 'PUT',
          headers: options.headers,
          body: buffer ? new Uint8Array(buffer) : new Uint8Array(file!.buffer),
        });

        // Bunny Storage 成功會回 201
        if (res.status === 201) {
          const currentFolder = config.folderName ? `${config.folderName}/` : '';
          const cdnUrl = `https://${config.storageZone}.b-cdn.net/${currentFolder}${filename}`;

          resolve({ res: true, message: 'upload success', url: cdnUrl });
        } else {
          reject({ res: false, message: 'Upload failed', error: await res.text() });
        }

        // const request = https.request(options, (response) => {
        //   if (response.statusCode === 201) {
        //     const currentFolder = config.folderName ? `${config.folderName}/` : '';
        //     const url = `https://${config.storageZone}.b-cdn.net/${currentFolder}${filename}`;
        //     resolve({ res: true, message: 'upload success', url });
        //   } else reject({ res: false, message: 'Upload failed' });
        // });
        // request.on('error', (error) => {
        //   reject({ res: false, message: 'Upload failed', error });
        // });
        // request.write(buffer || file!.buffer);
        // request.end();
      } catch (err) {
        reject({ res: false, message: 'Server error' });
      }
    },
  );
};

export const list = async (configOverrides: Partial<InstallParams> = {}) => {
  return new Promise<{ res: boolean; message: string; files?: File[] }>((resolve, reject) => {
    try {
      const config = getConfig(configOverrides);
      const hostName = config.region
        ? `${config.region}.${config.baseHostName}`
        : config.baseHostName;

      const currentFolder = config.folderName ? `${config.folderName}/` : '';
      const url = `https://${hostName}/${config.storageZone}/${currentFolder}`;
      const headers = { AccessKey: config.password };

      fetch(url, { headers })
        .then((response) => response.json())
        .then((data) => {
          const currentList = data.map((item: { [k: string]: any }) => {
            const Url = `https://${config.storageZone}.b-cdn.net/${currentFolder}${item.ObjectName}`;
            return { ...item, Url };
          });
          resolve({ res: true, message: 'List retrieved successfully', files: currentList });
        })
        .catch((error) => {
          reject({ res: false, message: 'Network error', error });
        });
    } catch (err) {
      reject({ res: false, message: 'Server error' });
    }
  });
};

export const deleteFile = ({
  ObjectName,
  href,
  ...configOverrides
}: { ObjectName?: string; href?: string } & Partial<InstallParams>) => {
  return new Promise<{ res: boolean; message: string }>((resolve, reject) => {
    if (!ObjectName && !href) {
      reject({ res: false, message: 'No file specified for deletion' });
      return;
    }
    try {
      const config = getConfig(configOverrides);
      const hostname = config.region
        ? `${config.region}.${config.baseHostName}`
        : config.baseHostName;

      const currentObjectName = href
        ? decodeURIComponent(href.split(`/`)[href.split(`/`).length - 1])
        : ObjectName!;

      fetch(`https://${hostname}/${config.storageZone}/${config.folderName}/${currentObjectName}`, {
        method: 'DELETE',
        headers: { AccessKey: config.password },
      })
        .then((response) => {
          if (response.status === 200) {
            resolve({ res: true, message: 'File deleted successfully' });
          } else {
            resolve({ res: false, message: 'Failed to delete file' });
          }
        })
        .catch((error) => {
          reject({ res: false, message: 'Network error', error });
        });
    } catch (err) {
      reject({ res: false, message: 'Server error' });
    }
  });
};

const BunnyCDN = { install, upload, list, deleteFile };

export default BunnyCDN;
