import { File, InstallParams, UploadParams } from './type';
export declare const install: ({ storageZone, password, region, folderName }: InstallParams) => void;
export declare const upload: ({ file, buffer, ...configOverrides }: UploadParams & Partial<InstallParams>) => Promise<{
    res: boolean;
    message: string;
    url?: string;
    error?: any;
}>;
export declare const list: (configOverrides?: Partial<InstallParams>) => Promise<{
    res: boolean;
    message: string;
    files?: File[];
}>;
export declare const deleteFile: ({ ObjectName, href, ...configOverrides }: {
    ObjectName?: string;
    href?: string;
} & Partial<InstallParams>) => Promise<{
    res: boolean;
    message: string;
}>;
declare const BunnyCDN: {
    install: ({ storageZone, password, region, folderName }: InstallParams) => void;
    upload: ({ file, buffer, ...configOverrides }: UploadParams & Partial<InstallParams>) => Promise<{
        res: boolean;
        message: string;
        url?: string;
        error?: any;
    }>;
    list: (configOverrides?: Partial<InstallParams>) => Promise<{
        res: boolean;
        message: string;
        files?: File[];
    }>;
    deleteFile: ({ ObjectName, href, ...configOverrides }: {
        ObjectName?: string;
        href?: string;
    } & Partial<InstallParams>) => Promise<{
        res: boolean;
        message: string;
    }>;
};
export default BunnyCDN;
