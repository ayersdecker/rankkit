// File utility functions tests
import {
  validateFile,
  formatFileSize,
  getFileIcon
} from '../fileUtils';

describe('File Utils', () => {
  describe('validateFile', () => {
    it('should accept valid text file', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('should accept valid PDF file', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('should accept valid DOCX file', () => {
      const file = new File(['content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('should reject file that is too large', () => {
      const largeContent = new Array(11 * 1024 * 1024).join('a'); // 11MB
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });

    it('should reject unsupported file type', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file type');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('getFileIcon', () => {
    it('should return correct icons', () => {
      expect(getFileIcon('application/pdf')).toBe('📄');
      expect(getFileIcon('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe('📝');
      expect(getFileIcon('application/msword')).toBe('📝');
      expect(getFileIcon('text/plain')).toBe('📃');
      expect(getFileIcon('unknown')).toBe('📎');
    });
  });
});
