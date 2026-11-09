import QRCodeStyling, { Options } from 'qr-code-styling';
import { QRConfig } from '../../../types/qr';
import { PayloadData } from '../../../types/payload';
import { compilePayload } from '../../../core/builders';

export type RasterFormat = 'png' | 'webp';
export type ExportResolution = 1024 | 2048 | 4096;

/**
 * Cria uma instância off-screen do QRCodeStyling escalando proporcionalmente
 * as margens para manter a fidelidade visual do preview (base 320px).
 */
function createOffscreenInstance(
  config: QRConfig,
  payload: PayloadData,
  targetSize: number
): QRCodeStyling {
  const scale = targetSize / 320;
  const scaledMargin = Math.round(config.margin * scale);
  const scaledImageMargin = Math.round(config.imageOptions.margin * scale);
  const compiledData = compilePayload(payload) || 'https://qrcraft.studio';

  const options: Partial<Options> = {
    width: targetSize,
    height: targetSize,
    type: 'canvas',
    data: compiledData,
    margin: scaledMargin,
    qrOptions: {
      errorCorrectionLevel: config.errorCorrectionLevel,
    },
    image: config.imageOptions.src || undefined,
    imageOptions: {
      hideBackgroundDots: config.imageOptions.hideBackgroundDots,
      imageSize: config.imageOptions.imageSize,
      margin: scaledImageMargin,
      crossOrigin: config.imageOptions.crossOrigin,
    },
    dotsOptions: {
      type: config.dotsOptions.type,
      color: config.dotsOptions.color,
      gradient: config.dotsOptions.gradient
        ? {
            type: config.dotsOptions.gradient.type,
            rotation: config.dotsOptions.gradient.rotation,
            colorStops: config.dotsOptions.gradient.colorStops,
          }
        : undefined,
    },
    cornersSquareOptions: {
      type: config.cornersSquareOptions.type,
      color: config.cornersSquareOptions.color,
      gradient: config.cornersSquareOptions.gradient
        ? {
            type: config.cornersSquareOptions.gradient.type,
            rotation: config.cornersSquareOptions.gradient.rotation,
            colorStops: config.cornersSquareOptions.gradient.colorStops,
          }
        : undefined,
    },
    cornersDotOptions: {
      type: config.cornersDotOptions.type,
      color: config.cornersDotOptions.color,
      gradient: config.cornersDotOptions.gradient
        ? {
            type: config.cornersDotOptions.gradient.type,
            rotation: config.cornersDotOptions.gradient.rotation,
            colorStops: config.cornersDotOptions.gradient.colorStops,
          }
        : undefined,
    },
    backgroundOptions: {
      color: config.backgroundOptions.color,
      gradient: config.backgroundOptions.gradient
        ? {
            type: config.backgroundOptions.gradient.type,
            rotation: config.backgroundOptions.gradient.rotation,
            colorStops: config.backgroundOptions.gradient.colorStops,
          }
        : undefined,
    },
  };

  return new QRCodeStyling(options);
}

export async function exportRasterImage(
  config: QRConfig,
  payload: PayloadData,
  size: ExportResolution,
  format: RasterFormat
): Promise<void> {
  const qr = createOffscreenInstance(config, payload, size);
  const rawBlob = await qr.getRawData(format);

  if (!rawBlob) {
    throw new Error('Falha ao renderizar imagem off-screen');
  }

  const url = URL.createObjectURL(rawBlob as Blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `qrcraft-${payload.type}-${size}px.${format}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function copyQrImageToClipboard(
  config: QRConfig,
  payload: PayloadData
): Promise<void> {
  const qr = createOffscreenInstance(config, payload, 1024);
  const rawBlob = await qr.getRawData('png');

  if (!rawBlob) {
    throw new Error('Falha ao gerar blob para a área de transferência');
  }

  const item = new ClipboardItem({ 'image/png': rawBlob as Blob });
  await navigator.clipboard.write([item]);
}
