import { ICalPayload } from '../../types/payload';

function formatICalDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICalText(text?: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n')
    .trim();
}

export function buildICalPayload(payload: ICalPayload): string {
  const dtStart = formatICalDate(payload.startDate);
  const dtEnd = formatICalDate(payload.endDate);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QRCraft Studio//PT-BR',
    'BEGIN:VEVENT',
    `SUMMARY:${escapeICalText(payload.title)}`,
  ];

  if (dtStart) lines.push(`DTSTART:${dtStart}`);
  if (dtEnd) lines.push(`DTEND:${dtEnd}`);
  if (payload.location) lines.push(`LOCATION:${escapeICalText(payload.location)}`);
  if (payload.description) lines.push(`DESCRIPTION:${escapeICalText(payload.description)}`);

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\n');
}
