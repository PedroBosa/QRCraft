export type PayloadType = 'url' | 'pix' | 'wifi' | 'vcard' | 'whatsapp' | 'ical';

export interface UrlPayload {
  type: 'url';
  rawUrl: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

export interface PixPayload {
  type: 'pix';
  pixKey: string;
  keyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  merchantName: string;
  merchantCity: string;
  transactionAmount?: number;
  txId?: string; // Padrão: '***' ou identificador alfanumérico
  description?: string;
}

export interface WifiPayload {
  type: 'wifi';
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardPayload {
  type: 'vcard';
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phoneWork?: string;
  phoneCell?: string;
  email?: string;
  url?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export interface WhatsAppPayload {
  type: 'whatsapp';
  countryCode: string;
  phoneNumber: string;
  message?: string;
}

export interface ICalPayload {
  type: 'ical';
  title: string;
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
  location?: string;
  description?: string;
}

export type PayloadData =
  | UrlPayload
  | PixPayload
  | WifiPayload
  | VCardPayload
  | WhatsAppPayload
  | ICalPayload;
