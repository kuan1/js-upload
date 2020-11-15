interface GetFileOptions {
    multiple?: boolean;
    accept?: string;
}
/**
 * 获取多个文件
 * @param option {GetFileOptions}
 */
export declare function getFiles(option?: GetFileOptions): Promise<FileList>;
/**
 * 获取单个文件
 * @param o {GetFileOptions}
 */
export declare function getFile(o: GetFileOptions): Promise<File>;
/**
 * 获取拖拽的文件
 */
export declare function getDropFile(e: DragEvent): FileList | undefined;
export {};
