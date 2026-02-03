// File upload and text extraction utilities

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  
  // Plain text files
  if (fileType === 'text/plain') {
    return await file.text();
  }
  
  // For PDF and DOCX, we'd need additional libraries
  // For now, return placeholder - we'll add proper extraction later
  if (fileType === 'application/pdf') {
    return '[PDF content - install pdf-parse for extraction]';
  }
  
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return '[DOCX content - install mammoth for extraction]';
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
