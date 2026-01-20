import { File, InstallParams, UploadParams } from './type';
export declare const install: ({ storageZone, password, region, folderName }: InstallParams) => void;
export declare const upload: ({ file, sharpConfig }: UploadParams) => Promise<{
    res: boolean;
    message: string;
    url?: string;
    error?: any;
}>;
export declare const list: () => Promise<{
    res: boolean;
    message: string;
    files?: File[];
}>;
export declare const deleteFile: ({ ObjectName, href }: {
    ObjectName?: string;
    href?: string;
}) => Promise<{
    res: boolean;
    message: string;
}>;
declare const BunnyCDN: {
    install: ({ storageZone, password, region, folderName }: InstallParams) => void;
    upload: ({ file, sharpConfig }: UploadParams) => Promise<{
        res: boolean;
        message: string;
        url?: string;
        error?: any;
    }>;
    list: () => Promise<{
        res: boolean;
        message: string;
        files?: File[];
    }>;
    deleteFile: ({ ObjectName, href }: {
        ObjectName?: string;
        href?: string;
    }) => Promise<{
        res: boolean;
        message: string;
    }>;
};
export default BunnyCDN;
