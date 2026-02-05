declare module 'file-saver' {
  export function saveAs(data: Blob | File, filename?: string, options?: FileSaverOptions): void;
  
  export interface FileSaverOptions {
    autoBom?: boolean;
  }

  export default saveAs;
}
