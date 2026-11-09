import { PixPayload } from '../../types/payload';
import { calculateCRC16 } from '../algorithms/crc16';

function formatTLV(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

function sanitizeText(text: string, maxLength: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .substring(0, maxLength);
}

/**
 * Normaliza a chave PIX conforme regulamentação do Banco Central:
 * - CPF/CNPJ: apenas dígitos numéricos
 * - Telefone: formato internacional E.164 (+55 + DDD + dígitos)
 * - E-mail: minúsculas e sem espaços
 * - Aleatória (EVP): preserva o formato UUID
 */
export function normalizePixKey(key: string, type: PixPayload['keyType']): string {
  const trimmed = key.trim();
  switch (type) {
    case 'cpf':
    case 'cnpj':
      return trimmed.replace(/\D/g, '');

    case 'phone': {
      const digits = trimmed.replace(/\D/g, '');
      if (digits.startsWith('55') && digits.length > 11) {
        return `+${digits}`;
      }
      return `+55${digits}`;
    }

    case 'email':
      return trimmed.toLowerCase();

    case 'random':
    default:
      return trimmed;
  }
}

export function buildPixEMVPayload(pix: PixPayload): string {
  // Tag 00: Payload Format Indicator
  let payload = formatTLV('00', '01');

  // Tag 26: Merchant Account Information - PIX
  const gui = formatTLV('00', 'br.gov.bcb.pix');
  const normalizedKey = normalizePixKey(pix.pixKey, pix.keyType);
  const key = formatTLV('01', normalizedKey);
  const description = pix.description
    ? formatTLV('02', sanitizeText(pix.description, 40))
    : '';
  payload += formatTLV('26', `${gui}${key}${description}`);

  // Tag 52: Merchant Category Code
  payload += formatTLV('52', '0000');

  // Tag 53: Transaction Currency (986 = BRL)
  payload += formatTLV('53', '986');

  // Tag 54: Transaction Amount (Opcional)
  if (pix.transactionAmount && pix.transactionAmount > 0) {
    payload += formatTLV('54', pix.transactionAmount.toFixed(2));
  }

  // Tag 58: Country Code
  payload += formatTLV('58', 'BR');

  // Tag 59: Merchant Name (Máx 25)
  payload += formatTLV('59', sanitizeText(pix.merchantName, 25));

  // Tag 60: Merchant City (Máx 15)
  payload += formatTLV('60', sanitizeText(pix.merchantCity, 15));

  // Tag 62: Additional Data Field (TxID)
  const txIdValue = pix.txId ? sanitizeText(pix.txId, 25) : '***';
  const additionalData = formatTLV('05', txIdValue);
  payload += formatTLV('62', additionalData);

  // Tag 63: CRC16
  const payloadToSign = `${payload}6304`;
  const checksum = calculateCRC16(payloadToSign);

  return `${payloadToSign}${checksum}`;
}
