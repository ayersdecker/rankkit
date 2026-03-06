import { jsPDF } from 'jspdf';
import { Document as DocxDocument, Paragraph, TextRun, Packer } from 'docx';
import { saveAs } from 'file-saver';

export type ExportDensityLevel = 1 | 2 | 3 | 4 | 5;
export type ExportStyleLevel = 1 | 2 | 3 | 4 | 5;
export type ExportPalette =
  | 'professional-blue'
  | 'graphite'
  | 'emerald'
  | 'burgundy'
  | 'slate';

export interface ExportOptions {
  densityLevel?: ExportDensityLevel;
  styleLevel?: ExportStyleLevel;
  palette?: ExportPalette;
}

export const EXPORT_DENSITY_OPTIONS: Array<{ level: ExportDensityLevel; label: string; description: string }> = [
  { level: 1, label: 'Level 1 - Spacious', description: 'Larger margins and airy spacing.' },
  { level: 2, label: 'Level 2 - Relaxed', description: 'Slightly reduced spacing.' },
  { level: 3, label: 'Level 3 - Standard', description: 'Balanced spacing for most documents.' },
  { level: 4, label: 'Level 4 - Tight', description: 'More compact layout to fit extra content.' },
  { level: 5, label: 'Level 5 - Condensed', description: 'Maximum compaction for page efficiency.' }
];

export const EXPORT_STYLE_OPTIONS: Array<{ level: ExportStyleLevel; label: string; description: string }> = [
  { level: 1, label: 'Level 1 - Classic', description: 'Traditional and conservative layout.' },
  { level: 2, label: 'Level 2 - Modern', description: 'Clean hierarchy with subtle emphasis.' },
  { level: 3, label: 'Level 3 - Structured', description: 'Clear section separation and rhythm.' },
  { level: 4, label: 'Level 4 - Editorial', description: 'Higher contrast heading treatment.' },
  { level: 5, label: 'Level 5 - Impact', description: 'Bold hierarchy for standout sections.' }
];

export const EXPORT_PALETTE_OPTIONS: Array<{ value: ExportPalette; label: string; description: string }> = [
  { value: 'professional-blue', label: 'Professional Blue', description: 'Trustworthy blue accents.' },
  { value: 'graphite', label: 'Graphite', description: 'Neutral grayscale with muted contrast.' },
  { value: 'emerald', label: 'Emerald', description: 'Fresh green accents for headings.' },
  { value: 'burgundy', label: 'Burgundy', description: 'Executive red tone with deep contrast.' },
  { value: 'slate', label: 'Slate', description: 'Modern cool-gray and steel-blue accents.' }
];

type PdfFontFamily = 'helvetica' | 'times' | 'courier';

type PaletteConfig = {
  headingPrimary: [number, number, number];
  headingSecondary: [number, number, number];
  body: [number, number, number];
  emphasis: [number, number, number];
  wordHeadingPrimary: string;
  wordHeadingSecondary: string;
  wordBody: string;
};

type DensityConfig = {
  marginMm: number;
  lineHeightMm: number;
  paragraphSpacingMultiplier: number;
  bulletSpacingMultiplier: number;
  emptyLineSpacingMultiplier: number;
  fontScale: number;
  headingScale: number;
  wordMarginTwips: number;
  wordParagraphSpacingTwips: number;
  wordBulletSpacingTwips: number;
};

type StyleConfig = {
  pdfFontFamily: PdfFontFamily;
  wordFontFamily: string;
  bodySizePt: number;
  headingSizesPt: [number, number, number, number, number];
  headingSpacingMultiplier: number;
};

type ResolvedExportOptions = {
  densityLevel: ExportDensityLevel;
  styleLevel: ExportStyleLevel;
  palette: ExportPalette;
};

const DENSITY_CONFIG: Record<ExportDensityLevel, DensityConfig> = {
  1: {
    marginMm: 24,
    lineHeightMm: 6.8,
    paragraphSpacingMultiplier: 0.5,
    bulletSpacingMultiplier: 0.3,
    emptyLineSpacingMultiplier: 0.45,
    fontScale: 1.03,
    headingScale: 1.02,
    wordMarginTwips: 1440,
    wordParagraphSpacingTwips: 180,
    wordBulletSpacingTwips: 110
  },
  2: {
    marginMm: 22,
    lineHeightMm: 6.3,
    paragraphSpacingMultiplier: 0.42,
    bulletSpacingMultiplier: 0.24,
    emptyLineSpacingMultiplier: 0.38,
    fontScale: 1,
    headingScale: 1,
    wordMarginTwips: 1260,
    wordParagraphSpacingTwips: 165,
    wordBulletSpacingTwips: 100
  },
  3: {
    marginMm: 20,
    lineHeightMm: 6,
    paragraphSpacingMultiplier: 0.3,
    bulletSpacingMultiplier: 0.15,
    emptyLineSpacingMultiplier: 0.3,
    fontScale: 1,
    headingScale: 1,
    wordMarginTwips: 1080,
    wordParagraphSpacingTwips: 140,
    wordBulletSpacingTwips: 90
  },
  4: {
    marginMm: 18,
    lineHeightMm: 5.6,
    paragraphSpacingMultiplier: 0.2,
    bulletSpacingMultiplier: 0.1,
    emptyLineSpacingMultiplier: 0.22,
    fontScale: 0.95,
    headingScale: 0.94,
    wordMarginTwips: 900,
    wordParagraphSpacingTwips: 120,
    wordBulletSpacingTwips: 80
  },
  5: {
    marginMm: 12,
    lineHeightMm: 4.5,
    paragraphSpacingMultiplier: 0.04,
    bulletSpacingMultiplier: 0,
    emptyLineSpacingMultiplier: 0.1,
    fontScale: 0.88,
    headingScale: 0.86,
    wordMarginTwips: 540,
    wordParagraphSpacingTwips: 45,
    wordBulletSpacingTwips: 30
  }
};

const STYLE_CONFIG: Record<ExportStyleLevel, StyleConfig> = {
  1: {
    pdfFontFamily: 'times',
    wordFontFamily: 'Cambria',
    bodySizePt: 11,
    headingSizesPt: [18, 14, 12, 11, 11],
    headingSpacingMultiplier: 1.5
  },
  2: {
    pdfFontFamily: 'helvetica',
    wordFontFamily: 'Calibri',
    bodySizePt: 11,
    headingSizesPt: [18, 14.5, 12, 11.5, 11],
    headingSpacingMultiplier: 1.4
  },
  3: {
    pdfFontFamily: 'helvetica',
    wordFontFamily: 'Aptos',
    bodySizePt: 10.8,
    headingSizesPt: [17.5, 14, 11.8, 11.2, 11],
    headingSpacingMultiplier: 1.3
  },
  4: {
    pdfFontFamily: 'times',
    wordFontFamily: 'Georgia',
    bodySizePt: 10.8,
    headingSizesPt: [18.5, 14.8, 12.2, 11.4, 11],
    headingSpacingMultiplier: 1.3
  },
  5: {
    pdfFontFamily: 'helvetica',
    wordFontFamily: 'Arial',
    bodySizePt: 10.6,
    headingSizesPt: [19, 15, 12.4, 11.4, 11],
    headingSpacingMultiplier: 1.25
  }
};

const PALETTE_CONFIG: Record<ExportPalette, PaletteConfig> = {
  'professional-blue': {
    headingPrimary: [31, 64, 122],
    headingSecondary: [44, 82, 130],
    body: [26, 26, 26],
    emphasis: [30, 58, 94],
    wordHeadingPrimary: '1F407A',
    wordHeadingSecondary: '2C5282',
    wordBody: '1A1A1A'
  },
  'graphite': {
    headingPrimary: [45, 55, 72],
    headingSecondary: [74, 85, 104],
    body: [28, 32, 38],
    emphasis: [60, 68, 82],
    wordHeadingPrimary: '2D3748',
    wordHeadingSecondary: '4A5568',
    wordBody: '1C2026'
  },
  emerald: {
    headingPrimary: [15, 95, 74],
    headingSecondary: [4, 120, 87],
    body: [26, 31, 33],
    emphasis: [6, 95, 70],
    wordHeadingPrimary: '0F5F4A',
    wordHeadingSecondary: '047857',
    wordBody: '1A1F21'
  },
  burgundy: {
    headingPrimary: [114, 28, 47],
    headingSecondary: [153, 27, 48],
    body: [33, 25, 28],
    emphasis: [127, 29, 29],
    wordHeadingPrimary: '721C2F',
    wordHeadingSecondary: '991B30',
    wordBody: '21191C'
  },
  slate: {
    headingPrimary: [47, 72, 88],
    headingSecondary: [71, 85, 105],
    body: [24, 32, 40],
    emphasis: [51, 65, 85],
    wordHeadingPrimary: '2F4858',
    wordHeadingSecondary: '475569',
    wordBody: '182028'
  }
};

function normalizeLevel(level: number | undefined): ExportDensityLevel | ExportStyleLevel {
  if (!level || Number.isNaN(level)) {
    return 3;
  }

  if (level <= 1) return 1;
  if (level >= 5) return 5;
  return Math.round(level) as ExportDensityLevel | ExportStyleLevel;
}

function resolveExportOptions(options?: ExportOptions): ResolvedExportOptions {
  const densityLevel = normalizeLevel(options?.densityLevel) as ExportDensityLevel;
  const styleLevel = normalizeLevel(options?.styleLevel) as ExportStyleLevel;
  const palette = options?.palette && PALETTE_CONFIG[options.palette] ? options.palette : 'professional-blue';

  return {
    densityLevel,
    styleLevel,
    palette
  };
}

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

  // Check if looks like heading by formatting (ALL CAPS section label)
  if (!result.isHeading && trimmed.length < 60) {
    if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
      result.isHeading = true;
      // Default these to section-level headings, not top-level title.
      result.headingLevel = 2;
    }
  }

  return result;
}

function normalizeResumeHierarchy(content: string): string {
  const lines = content.split('\n');

  const firstNonEmptyIndex = lines.findIndex((line) => line.trim().length > 0);
  if (firstNonEmptyIndex === -1) {
    return content;
  }

  const firstLine = lines[firstNonEmptyIndex].trim();

  // Promote the first non-empty line to top-level heading if it is not already markdown.
  if (!firstLine.match(/^#{1,6}\s+/) && !firstLine.match(/^[-*•]\s+/) && firstLine.length < 80) {
    lines[firstNonEmptyIndex] = `# ${firstLine}`;
  }

  let seenTopHeading = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const markdownHeading = trimmed.match(/^(#{1,6})\s+(.+)$/);

    if (markdownHeading) {
      const level = markdownHeading[1].length;
      const headingText = markdownHeading[2].trim();

      if (!seenTopHeading && i >= firstNonEmptyIndex) {
        seenTopHeading = true;
        lines[i] = `# ${headingText}`;
        continue;
      }

      // Prevent extra top-level headings deeper in the document.
      if (seenTopHeading && level === 1) {
        lines[i] = `## ${headingText}`;
      }
      continue;
    }

    // Convert all-caps section labels to markdown section headings.
    if (/^[A-Z][A-Z\s&/\-]{3,}$/.test(trimmed) && trimmed.length <= 60) {
      lines[i] = `## ${trimmed}`;
    }
  }

  return lines.join('\n');
}

/**
 * Export document as PDF
 */
export async function exportAsPDF(content: string, fileName: string, options?: ExportOptions): Promise<void> {
  try {
    const resolvedOptions = resolveExportOptions(options);
    const densityConfig = DENSITY_CONFIG[resolvedOptions.densityLevel];
    const styleConfig = STYLE_CONFIG[resolvedOptions.styleLevel];
    const paletteConfig = PALETTE_CONFIG[resolvedOptions.palette];

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set font and styling
    doc.setFont(styleConfig.pdfFontFamily);
    
    // Add margins
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = densityConfig.marginMm;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = densityConfig.lineHeightMm;
    let yPosition = margin;

    // Normalize hierarchy to keep name/contact prominence consistent.
    const normalizedContent = normalizeResumeHierarchy(content);

    // Split content by paragraphs
    const paragraphs = normalizedContent.split('\n');
    
    const bodySizePt = Math.max(8.5, styleConfig.bodySizePt * densityConfig.fontScale);
    doc.setFontSize(bodySizePt);
    doc.setTextColor(...paletteConfig.body);

    paragraphs.forEach((paragraph) => {
      const parsed = parseLine(paragraph);
      
      if (!parsed.text) {
        // Empty line - add spacing
        yPosition += lineHeight * densityConfig.emptyLineSpacingMultiplier;
        return;
      }

      // Set styling based on parsed format
      if (parsed.isHeading) {
        const baseHeadingSize = styleConfig.headingSizesPt[Math.min(parsed.headingLevel - 1, 4)] || styleConfig.bodySizePt;
        const headingSize = Math.max(bodySizePt + 0.6, baseHeadingSize * densityConfig.headingScale);
        doc.setFontSize(headingSize);
        doc.setFont(styleConfig.pdfFontFamily, 'bold');
        doc.setTextColor(...(parsed.headingLevel <= 2 ? paletteConfig.headingPrimary : paletteConfig.headingSecondary));
        
        // Add extra space before headings (except first one)
        if (yPosition > margin + 5) {
          yPosition += lineHeight * styleConfig.headingSpacingMultiplier;
        }
        
        // Prevent headings from being orphaned at bottom of page
        // Check if there's room for heading + at least 2-3 lines of content
        const minSpaceNeeded = lineHeight * 3; // Heading + 2 content lines
        if (yPosition + minSpaceNeeded > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
      } else if (parsed.isBold) {
        doc.setFontSize(bodySizePt);
        doc.setFont(styleConfig.pdfFontFamily, 'bold');
        doc.setTextColor(...paletteConfig.emphasis);
      } else {
        doc.setFontSize(bodySizePt);
        doc.setFont(styleConfig.pdfFontFamily, 'normal');
        doc.setTextColor(...paletteConfig.body);
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
        yPosition += lineHeight * 0.75;
      } else if (parsed.isBullet) {
        yPosition += lineHeight * densityConfig.bulletSpacingMultiplier;
      } else {
        yPosition += lineHeight * densityConfig.paragraphSpacingMultiplier;
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
export async function exportAsWord(content: string, fileName: string, options?: ExportOptions): Promise<void> {
  try {
    const resolvedOptions = resolveExportOptions(options);
    const densityConfig = DENSITY_CONFIG[resolvedOptions.densityLevel];
    const styleConfig = STYLE_CONFIG[resolvedOptions.styleLevel];
    const paletteConfig = PALETTE_CONFIG[resolvedOptions.palette];

    // Normalize hierarchy to keep name/contact prominence consistent.
    const normalizedContent = normalizeResumeHierarchy(content);

    // Split content into paragraphs
    const paragraphs = normalizedContent.split('\n');

    const bodySizePt = Math.max(8.5, styleConfig.bodySizePt * densityConfig.fontScale);
    
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
        const headingPt = styleConfig.headingSizesPt[Math.min(parsed.headingLevel - 1, 4)] || styleConfig.bodySizePt;
        const adjustedHeadingPt = Math.max(bodySizePt + 0.6, headingPt * densityConfig.headingScale);
        const size = Math.round(adjustedHeadingPt * 2); // in half-points
        
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: parsed.text,
                bold: true,
                size: size,
                color: parsed.headingLevel <= 2 ? paletteConfig.wordHeadingPrimary : paletteConfig.wordHeadingSecondary,
                font: styleConfig.wordFontFamily
              })
            ],
            spacing: {
              before: Math.round(densityConfig.wordParagraphSpacingTwips * styleConfig.headingSpacingMultiplier + 80),
              after: Math.round(densityConfig.wordParagraphSpacingTwips)
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
                size: Math.round(bodySizePt * 2),
                color: paletteConfig.wordBody,
                font: styleConfig.wordFontFamily
              })
            ],
            bullet: {
              level: 0
            },
            spacing: {
              before: densityConfig.wordBulletSpacingTwips,
              after: densityConfig.wordBulletSpacingTwips
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
                size: Math.round(bodySizePt * 2),
                bold: parsed.isBold,
                color: parsed.isBold ? paletteConfig.wordHeadingSecondary : paletteConfig.wordBody,
                font: styleConfig.wordFontFamily
              })
            ],
            spacing: {
              before: densityConfig.wordParagraphSpacingTwips,
              after: densityConfig.wordParagraphSpacingTwips
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
              top: densityConfig.wordMarginTwips,
              right: densityConfig.wordMarginTwips,
              bottom: densityConfig.wordMarginTwips,
              left: densityConfig.wordMarginTwips
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
