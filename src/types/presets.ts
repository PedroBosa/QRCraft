import { QRConfig } from './qr';
import { PayloadData } from './payload';

export interface Preset {
  id: string;
  name: string;
  description: string;
  config: QRConfig;
  thumbnailSvg?: string;
  isCustom?: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  payload: PayloadData;
  config: QRConfig;
  previewDataUrl: string;
}
