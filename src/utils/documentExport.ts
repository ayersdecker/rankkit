import { jsPDF } from 'jspdf';
import { Document as DocxDocument, Paragraph, TextRun, Packer } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Parse line to detect formatting and extract clean text
 */
interface ParsedLine {
  text: string;
  isHeading: boolean;
  headingLevel: number;
  isBullet: boolean;
  isBold: boolean;
  isItalic: boolean;
  indent: number;
}

function parseLine(line: string): ParsedLine {
  const trimmed = line.trim();
  const result: ParsedLine = {
    text: trimmed,
    isHeading: false,
    headingLevel: 0,
    isBullet: false,
    isBold: false,
    isItalic: false,
    indent: 0
  };

  if (!trimmed) {
    return result;
  }

  // Check for markdown headings (# Heading)
  const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
  if (headingMatch) {
    result.isHeading = true;
    result.headingLevel = headingMatch[1].length;
    result.text = headingMatch[2].trim();
    return result;
  }

  // Check for bullet points (-, *, •)
  const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
  if (bulletMatch) {
    result.isBullet = true;
    result.text = bulletMatch[1].trim();
  }

  // Check for numbered lists (1., 2., etc.)
  const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
  if (numberedMatch) {
    result.isBullet = true;
    result.text = numberedMatch[1].trim();
  }

  // Clean up bold markdown (**text** or __text__)
  result.text = result.text.replace(/\*\*(.+?)\*\*/g, '$1');
  result.text = result.text.replace(/__(.+?)__/g, '$1');

  // Clean up italic markdown (*text* or _text_)
  result.text = result.text.replace(/\*(.+?)\*/g, '$1');
  result.text = result.text.replace(/_(.+?)_/g, '$1');

  // Check if entire line is bold (starts and ends with **)
  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
    result.isBold = true;
  }

  // Check if looks like heading by formatting (ALL CAPS or title case)
  if (!result.isHeading && trimmed.length < 60) {
    if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
      result.isHeading = true;
      result.headingLevel = 1;
    }
  }

  return result;
}

/**
 * Export document as PDF
 */
export async function exportAsPDF(content: string, fileName: string): Promise<void> {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set font and styling
    doc.setFont('helvetica');
    
    // Add margins
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 6;
    let yPosition = margin;

    // Split content by paragraphs
    const paragraphs = content.split('\n');
    
    doc.setFontSize(12);

    paragraphs.forEach((paragraph) => {
      const parsed = parseLine(paragraph);
      
      if (!parsed.text) {
        // Empty line - add spacing
        yPosition += lineHeight / 2;
        return;
      }

      // Set styling based on parsed format
      if (parsed.isHeading) {
        const headingSizes = [18, 14, 12, 11, 11];
        doc.setFontSize(headingSizes[Math.min(parsed.headingLevel - 1, 4)] || 12);
        doc.setFont('helvetica', 'bold');
        
        // Add extra space before headings (except first one)
        if (yPosition > margin + 5) {
          yPosition += lineHeight * 1.5;
        }
        
        // Prevent headings from being orphaned at bottom of page
        // Check if there's room for heading + at least 2-3 lines of content
        const minSpaceNeeded = lineHeight * 3; // Heading + 2 content lines
        if (yPosition + minSpaceNeeded > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
      } else if (parsed.isBold) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
      }

      // Handle bullet points with proper indentation
      const textToRender = parsed.isBullet ? `• ${parsed.text}` : parsed.text;
      const leftMargin = parsed.isBullet ? margin + 5 : margin;
      const renderWidth = parsed.isBullet ? maxWidth - 5 : maxWidth;

      // Word wrap the text
      const lines = doc.splitTextToSize(textToRender, renderWidth);
      
      lines.forEach((line: string, index: number) => {
        // Check if we need a new page (for regular content)
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        // For bullet points, only indent the first line
        const lineMargin = (parsed.isBullet && index > 0) ? leftMargin + 5 : leftMargin;
        doc.text(line, lineMargin, yPosition);
        yPosition += lineHeight;
      });

      // Add extra space after headings and paragraphs
      if (parsed.isHeading) {
        yPosition += lineHeight * 0.8;
      } else if (parsed.isBullet) {
        yPosition += lineHeight * 0.15;
      } else {
        yPosition += lineHeight * 0.3;
      }
    });

    // Save the PDF
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Failed to export document as PDF');
  }
}

/**
 * Export document as Word (.docx)
 */
export async function exportAsWord(content: string, fileName: string): Promise<void> {
  try {
    // Split content into paragraphs
    const paragraphs = content.split('\n');
    
    const docParagraphs: Paragraph[] = [];

    paragraphs.forEach((paragraph) => {
      const parsed = parseLine(paragraph);
      
      if (!parsed.text) {
        // Empty paragraph - add spacing
        docParagraphs.push(new Paragraph({ text: '' }));
        return;
      }

      // Handle headings
      if (parsed.isHeading) {
        const headingSizes = [32, 28, 24, 22, 22]; // in half-points (16pt, 14pt, 12pt, 11pt, 11pt)
        const size = headingSizes[Math.min(parsed.headingLevel - 1, 4)] || 24;
        
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: parsed.text,
                bold: true,
                size: size
              })
            ],
            spacing: {
              before: 280,
              after: 160
            },
            // Keep heading with next paragraph to prevent orphaning
            keepNext: true
          })
        );
      } else if (parsed.isBullet) {
        // Handle bullet points with clean text
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: parsed.text,
                size: 22 // 11pt
              })
            ],
            bullet: {
              level: 0
            },
            spacing: {
              before: 80,
              after: 80
            }
          })
        );
      } else {
        // Regular paragraph with optional bold
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: parsed.text,
                size: 22, // 11pt
                bold: parsed.isBold
              })
            ],
            spacing: {
              before: 140,
              after: 140
            }
          })
        );
      }
    });

    // Create the document
    const doc = new DocxDocument({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: docParagraphs
      }]
    });

    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
  } catch (error) {
    console.error('Error exporting Word document:', error);
    throw new Error('Failed to export document as Word');
  }
}

/**
 * Format filename for export
 */
export function formatExportFileName(fileName: string): string {
  // Remove file extension if present
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  // Replace spaces and special characters with underscores
  return nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
}

/**
 * Check if content is exportable
 */
export function isExportable(content: string): boolean {
  return !!(content && content.trim().length > 0);
}
