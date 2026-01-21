import { File, InstallParams, UploadParams } from './type';
export default class BunnyCDNClient {
    private config;
    constructor({ storageZone, password, region, folderName }: InstallParams);
    upload({ file, buffer }: UploadParams): Promise<{
        res: boolean;
        message: string;
        url?: string;
        error?: any;
    }>;
    list(): Promise<{
        res: boolean;
        message: string;
        files?: File[];
    }>;
    deleteFile({ ObjectName, href }: {
        ObjectName?: string;
        href?: string;
    }): Promise<{
        res: boolean;
        message: string;
    }>;
}
