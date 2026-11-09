import { VCardPayload } from '../../types/payload';

function escapeVCardValue(value?: string): string {
  if (!value) return '';
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n')
    .trim();
}

export function buildVCardPayload(payload: VCardPayload): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCardValue(payload.lastName)};${escapeVCardValue(payload.firstName)};;;`,
    `FN:${escapeVCardValue(`${payload.firstName} ${payload.lastName}`.trim())}`,
  ];

  if (payload.organization) {
    lines.push(`ORG:${escapeVCardValue(payload.organization)}`);
  }
  if (payload.title) {
    lines.push(`TITLE:${escapeVCardValue(payload.title)}`);
  }
  if (payload.phoneCell) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCardValue(payload.phoneCell)}`);
  }
  if (payload.phoneWork) {
    lines.push(`TEL;TYPE=WORK,VOICE:${escapeVCardValue(payload.phoneWork)}`);
  }
  if (payload.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(payload.email)}`);
  }
  if (payload.url) {
    lines.push(`URL:${escapeVCardValue(payload.url)}`);
  }
  if (payload.address) {
    const { street, city, state, zip, country } = payload.address;
    lines.push(
      `ADR;TYPE=WORK:;;${escapeVCardValue(street)};${escapeVCardValue(city)};${escapeVCardValue(state)};${escapeVCardValue(zip)};${escapeVCardValue(country)}`
    );
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}
