import { randomUUID } from 'crypto';
import https from 'https';
import sharp from 'sharp';
import { File, InstallParams, UploadParams } from './type';

const config = {
  region: 'SG',
  baseHostName: 'storage.bunnycdn.com',
  folderName: '',
  storageZone: 'unset',
  password: 'unset',
};

export const install = ({ storageZone, password, region, folderName }: InstallParams) => {
  config.region = region || config.region;
  config.folderName = folderName || config.folderName;
  config.storageZone = storageZone || config.storageZone;
  config.password = password;
};

export const upload = async ({ file, sharpConfig }: UploadParams) => {
  return new Promise<{ res: boolean; message: string; url?: string; error?: any }>(
    async (resolve, reject) => {
      try {
        if (!file) reject({ res: false, message: 'No file uploaded' });
        const buffer = await sharp(file?.buffer)
          .resize({
            width: sharpConfig.width,
            height: sharpConfig.height,
            withoutEnlargement: true,
          })
          .toFormat(sharpConfig.format || 'webp', { quality: sharpConfig.quality || 80 })
          .toBuffer();
        const filename = `${randomUUID()}.${sharpConfig.format || 'webp'}`;
        const options = {
          method: 'PUT',
          hostname: config.region ? `${config.region}.${config.baseHostName}` : config.baseHostName,
          port: 443,
          path: `/${config.storageZone}/${config.folderName}/${filename}`,
          headers: {
            AccessKey: config.password,
            'Content-Type': 'application/octet-stream',
            'Content-Length': buffer.length,
          },
        };
        const request = https.request(options, (response) => {
          if (response.statusCode === 201) {
            const currentFolder = config.folderName ? `${config.folderName}/` : '';
            const url = `https://${config.storageZone}.b-cdn.net/${currentFolder}${filename}`;
            resolve({ res: true, message: 'upload success', url });
          } else reject({ res: false, message: 'Upload failed' });
        });
        request.on('error', (error) => {
          reject({ res: false, message: 'Upload failed', error });
        });
        request.write(buffer);
        request.end();
      } catch (err) {
        reject({ res: false, message: 'Server error' });
      }
    },
  );
};

export const list = async () => {
  return new Promise<{ res: boolean; message: string; files?: File[] }>((resolve, reject) => {
    try {
      const hostName = config.region
        ? `${config.region}.${config.baseHostName}`
        : config.baseHostName;

      const currentFolder = config.folderName ? `${config.folderName}/` : '';
      const url = `https://${hostName}/${config.storageZone}/${currentFolder}`;
      const headers = { AccessKey: config.password };
      https
        .get(url, { headers }, (response) => {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            try {
              const list = JSON.parse(data);
              const currentList = list.map((item: { [k: string]: any }) => {
                const Url = `https://${config.storageZone}.b-cdn.net/${currentFolder}${item.ObjectName}`;
                return { ...item, Url };
              });
              resolve({ res: true, message: 'List retrieved successfully', files: currentList });
            } catch (err) {
              reject({ res: false, message: 'Failed to parse response' });
            }
          });
        })
        .on('error', (error) => {
          reject({ res: false, message: 'Network error', error });
        });
    } catch (err) {
      reject({ res: false, message: 'Server error' });
    }
  });
};

export const deleteFile = ({ ObjectName, href }: { ObjectName?: string; href?: string }) => {
  return new Promise<{ res: boolean; message: string }>((resolve, reject) => {
    if (!ObjectName && !href) {
      reject({ res: false, message: 'No file specified for deletion' });
      return;
    }
    try {
      const hostname = config.region
        ? `${config.region}.${config.baseHostName}`
        : config.baseHostName;

      const currentObjectName = href
        ? decodeURIComponent(href.split(`/`)[href.split(`/`).length - 1])
        : ObjectName!;

      https
        .request(
          {
            method: 'DELETE',
            hostname,
            path: `/${config.storageZone}/${config.folderName}/${currentObjectName}`,
            headers: { AccessKey: config.password },
          },
          (response) => {
            if (response.statusCode === 200) {
              resolve({ res: true, message: 'File deleted successfully' });
            } else {
              resolve({ res: false, message: 'Failed to delete file' });
            }
          },
        )
        .end();
    } catch (err) {
      reject({ res: false, message: 'Server error' });
    }
  });
};

const BunnyCDN = { install, upload, list, deleteFile };

export default BunnyCDN;
