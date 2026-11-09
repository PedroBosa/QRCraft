import { PayloadData } from '../../types/payload';
import { buildUrlWithUtm } from './utm';
import { buildPixEMVPayload } from './emv-pix';
import { buildWifiPayload } from './wifi';
import { buildVCardPayload } from './vcard';
import { buildWhatsAppPayload } from './whatsapp';
import { buildICalPayload } from './ical';

export function compilePayload(data: PayloadData): string {
  switch (data.type) {
    case 'url':
      return buildUrlWithUtm(data);
    case 'pix':
      return buildPixEMVPayload(data);
    case 'wifi':
      return buildWifiPayload(data);
    case 'vcard':
      return buildVCardPayload(data);
    case 'whatsapp':
      return buildWhatsAppPayload(data);
    case 'ical':
      return buildICalPayload(data);
    default:
      return '';
  }
}

export {
  buildUrlWithUtm,
  buildPixEMVPayload,
  buildWifiPayload,
  buildVCardPayload,
  buildWhatsAppPayload,
  buildICalPayload,
};
