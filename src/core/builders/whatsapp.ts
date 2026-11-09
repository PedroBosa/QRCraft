import { WhatsAppPayload } from '../../types/payload';

export function buildWhatsAppPayload(payload: WhatsAppPayload): string {
  const cleanCountry = payload.countryCode.replace(/\D/g, '');
  const cleanPhone = payload.phoneNumber.replace(/\D/g, '');
  const fullPhone = `${cleanCountry}${cleanPhone}`;

  if (!fullPhone) return '';

  const baseUrl = `https://wa.me/${fullPhone}`;
  if (payload.message && payload.message.trim()) {
    return `${baseUrl}?text=${encodeURIComponent(payload.message.trim())}`;
  }

  return baseUrl;
}
