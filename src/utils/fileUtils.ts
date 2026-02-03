// File upload and text extraction utilities
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  
  // Plain text files
  if (fileType === 'text/plain') {
    return await file.text();
  }
  
  // DOCX files
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword' ||
      file.name.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting DOCX:', error);
      throw new Error('Failed to extract text from Word document');
    }
  }
  
  // For PDF, we'd need additional libraries
  if (fileType === 'application/pdf') {
    throw new Error('PDF support coming soon. Please convert to .docx or .txt for now.');
  }
  
  // Fallback to text extraction
  return await file.text();
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 10MB.' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type. Please upload TXT, PDF, or DOCX.' };
  }
  
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('text')) return '📃';
  return '📎';
}

export function estimatePageCount(text: string): number {
  // Rough estimate: ~500 words per page, ~5 chars per word
  const charsPerPage = 2500;
  const pageCount = Math.ceil(text.length / charsPerPage);
  return pageCount;
}

export function validateDocumentPages(text: string, maxPages: number = 3): { valid: boolean; error?: string; pageCount: number } {
  const pageCount = estimatePageCount(text);
  
  if (pageCount > maxPages) {
    return { 
      valid: false, 
      error: `Document is too long (approximately ${pageCount} pages). Maximum allowed is ${maxPages} pages.`,
      pageCount 
    };
  }
  
  return { valid: true, pageCount };
}
