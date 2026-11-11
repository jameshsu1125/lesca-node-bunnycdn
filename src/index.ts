import { File, InstallParams, ListParams, UploadParams } from './type';

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

// 檔名加上隨機碼：只用毫秒時間會讓連續（或同毫秒）上傳的檔案撞名，後者覆蓋前者。
const randomId = (length = 8) => {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else bytes.forEach((_, i) => (bytes[i] = Math.floor(Math.random() * 256)));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
};

type TUploadResult = { res: boolean; message: string; url?: string; error?: unknown };

export const upload = async ({
  file,
  buffer,
  folder,
  format,
  ...configOverrides
}: UploadParams & Partial<InstallParams>): Promise<TUploadResult> => {
  const body = buffer || file?.buffer;
  if (!body) throw { res: false, message: 'No file uploaded' };

  try {
    const config = getConfig(configOverrides);
    const baseFolder = config.folderName ? `${config.folderName}/` : '';
    const subFolder = folder ? `${folder}/` : '';
    const currentFormat = format ? format : 'jpg';
    const filename = `${new Date().getTime()}-${randomId()}.${currentFormat}`;
    const hostname = config.region
      ? `${config.region}.${config.baseHostName}`
      : config.baseHostName;

    const res = await fetch(
      `https://${hostname}/${config.storageZone}/${baseFolder}${subFolder}${filename}`,
      {
        method: 'PUT',
        headers: {
          AccessKey: config.password,
          'Content-Type': 'application/octet-stream',
          'Content-Length': body.length.toString(),
        },
        body: body as BodyInit,
      },
    );

    // Bunny Storage 成功會回 201
    if (res.status === 201) {
      const cdnUrl = `https://${config.storageZone}.b-cdn.net/${baseFolder}${subFolder}${filename}`;
      return { res: true, message: 'upload success', url: cdnUrl };
    }
    throw { res: false, message: 'Upload failed', error: await res.text() };
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'res' in err) throw err;
    throw { res: false, message: 'Server error' };
  }
};

export const list = async ({ folder = '', configOverrides = {} }: ListParams = {}) => {
  return new Promise<{ res: boolean; message: string; files?: File[] }>((resolve, reject) => {
    try {
      const config = getConfig(configOverrides);
      const hostName = config.region
        ? `${config.region}.${config.baseHostName}`
        : config.baseHostName;

      const baseFolder = config.folderName ? `${config.folderName}/` : '';
      const subFolder = folder ? `${folder}/` : '';

      const url = `https://${hostName}/${config.storageZone}/${baseFolder}${subFolder}`;
      const headers = { AccessKey: config.password };

      fetch(url, { headers })
        .then((response) => response.json())
        .then((data) => {
          const currentList = data.map((item: { [k: string]: unknown }) => {
            const Url = `https://${config.storageZone}.b-cdn.net/${baseFolder}${subFolder}${item.ObjectName}`;
            return { ...item, Url };
          });
          resolve({ res: true, message: 'List retrieved successfully', files: currentList });
        })
        .catch((error) => {
          reject({ res: false, message: 'Network error', error });
        });
    } catch {
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
      // 解析 href 來提取檔案名稱和資料夾路徑
      let fileName = '';
      let folderPath = '';

      if (href) {
        // 移除 protocol 和 hostname
        const urlParts = href.split('/').filter((part) => part !== '' && !part.includes('http'));
        const isHasFile = [...urlParts].pop()?.includes('.') || false;
        if (isHasFile) {
          const urlArray = [...urlParts];
          fileName = decodeURIComponent(urlArray.pop() || '');
          folderPath = urlArray.splice(1, 1).join('/');
        } else {
          const urlArray = [...urlParts];
          folderPath = urlArray.splice(1, 1).join('/');
        }
      }

      const config = getConfig(configOverrides);
      const hostname = config.region
        ? `${config.region}.${config.baseHostName}`
        : config.baseHostName;
      const currentFolderPath = folderPath ? `/${folderPath}` : '';
      fetch(`https://${hostname}/${config.storageZone}${currentFolderPath}/${fileName}`, {
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
    } catch {
      reject({ res: false, message: 'Server error' });
    }
  });
};

const BunnyCDN = { install, upload, list, deleteFile };

export default BunnyCDN;
