type SectionContent = string | string[];

type DocumentSection = {
  heading: string;
  content: SectionContent;
};

export function formatPlainTextDocument(title: string, sections: DocumentSection[]): string {
  const lines: string[] = [];

  if (title) {
    lines.push(title, '');
  }

  sections.forEach((section) => {
    const hasContent = Array.isArray(section.content)
      ? section.content.length > 0
      : section.content.trim().length > 0;

    if (!hasContent) {
      return;
    }

    lines.push(section.heading);

    if (Array.isArray(section.content)) {
      section.content.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(section.content);
    }

    lines.push('');
  });

  return lines.join('\n').trim();
}

export function formatDocumentName(prefix: string): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${prefix} - ${dateStr} ${timeStr}`;
}
