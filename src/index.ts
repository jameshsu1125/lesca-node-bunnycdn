import { randomUUID } from 'crypto';
import https from 'https';
import { File, InstallParams, UploadParams } from './type';

export default class BunnyCDNClient {
  private config = {
    region: 'SG',
    baseHostName: 'storage.bunnycdn.com',
    folderName: '',
    storageZone: 'unset',
    password: 'unset',
  };

  constructor({ storageZone, password, region, folderName }: InstallParams) {
    this.config.region = region || this.config.region;
    this.config.folderName = folderName || this.config.folderName;
    this.config.storageZone = storageZone || this.config.storageZone;
    this.config.password = password;
    return this;
  }

  async upload({ file, buffer }: UploadParams) {
    return new Promise<{ res: boolean; message: string; url?: string; error?: any }>(
      async (resolve, reject) => {
        try {
          if (!buffer && !file) reject({ res: false, message: 'No file uploaded' });

          const filename = `${randomUUID()}.${'webp'}`;
          const len = buffer ? buffer.length : file!.buffer.length;

          const options = {
            method: 'PUT',
            hostname: this.config.region
              ? `${this.config.region}.${this.config.baseHostName}`
              : this.config.baseHostName,
            port: 443,
            path: `/${this.config.storageZone}/${this.config.folderName}/${filename}`,
            headers: {
              AccessKey: this.config.password,
              'Content-Type': 'application/octet-stream',
              'Content-Length': len,
            },
          };
          const request = https.request(options, (response) => {
            if (response.statusCode === 201) {
              const currentFolder = this.config.folderName ? `${this.config.folderName}/` : '';
              const url = `https://${this.config.storageZone}.b-cdn.net/${currentFolder}${filename}`;
              resolve({ res: true, message: 'upload success', url });
            } else reject({ res: false, message: 'Upload failed' });
          });
          request.on('error', (error) => {
            reject({ res: false, message: 'Upload failed', error });
          });
          request.write(buffer || file!.buffer);
          request.end();
        } catch (err) {
          reject({ res: false, message: 'Server error' });
        }
      },
    );
  }

  async list() {
    return new Promise<{ res: boolean; message: string; files?: File[] }>((resolve, reject) => {
      try {
        const hostName = this.config.region
          ? `${this.config.region}.${this.config.baseHostName}`
          : this.config.baseHostName;

        const currentFolder = this.config.folderName ? `${this.config.folderName}/` : '';
        const url = `https://${hostName}/${this.config.storageZone}/${currentFolder}`;
        const headers = { AccessKey: this.config.password };
        console.log(headers, currentFolder, url, hostName);

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
                  const Url = `https://${this.config.storageZone}.b-cdn.net/${currentFolder}${item.ObjectName}`;
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
  }

  async deleteFile({ ObjectName, href }: { ObjectName?: string; href?: string }) {
    return new Promise<{ res: boolean; message: string }>((resolve, reject) => {
      if (!ObjectName && !href) {
        reject({ res: false, message: 'No file specified for deletion' });
        return;
      }
      try {
        const hostname = this.config.region
          ? `${this.config.region}.${this.config.baseHostName}`
          : this.config.baseHostName;

        const currentObjectName = href
          ? decodeURIComponent(href.split(`/`)[href.split(`/`).length - 1])
          : ObjectName!;

        https
          .request(
            {
              method: 'DELETE',
              hostname,
              path: `/${this.config.storageZone}/${this.config.folderName}/${currentObjectName}`,
              headers: { AccessKey: this.config.password },
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
  }
}
