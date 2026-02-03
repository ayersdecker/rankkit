declare module 'mammoth' {
  interface ExtractRawTextResult {
    value: string;
    messages: unknown[];
  }

  interface ConvertToHtmlResult {
    value: string;
    messages: unknown[];
  }

  interface Options {
    arrayBuffer?: ArrayBuffer;
    path?: string;
  }

  export function extractRawText(options: Options): Promise<ExtractRawTextResult>;
  export function convertToHtml(options: Options): Promise<ConvertToHtmlResult>;
}
