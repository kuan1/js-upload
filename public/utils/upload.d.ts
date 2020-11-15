interface ProgressOptions {
    loaded: number;
    total: number;
}
interface UploadOptions {
    url: string;
    data: FormData;
    onProgress: (o: ProgressOptions) => void | undefined;
    toast: (text: string) => void | undefined;
    withCredentials: boolean;
}
/**
 * @description: 上传文件
 * @param url {String} 上传地址
 * @param data {FormData} 上传对象
 * @param withCredentials {Boolean} 是否携带cookie
 * @param onProgress {Function} 进度
 * @return Promise
 */
export default function upload(options: UploadOptions): Promise<any>;
export {};
