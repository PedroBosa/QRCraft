import QRCodeStyling, { Options } from 'qr-code-styling';
import { QRConfig } from '../../../types/qr';
import { PayloadData } from '../../../types/payload';
import { compilePayload } from '../../../core/builders';

export async function exportCleanSvg(
  config: QRConfig,
  payload: PayloadData
): Promise<void> {
  const targetSize = 1024;
  const scale = targetSize / 320;
  const scaledMargin = Math.round(config.margin * scale);
  const scaledImageMargin = Math.round(config.imageOptions.margin * scale);
  const compiledData = compilePayload(payload) || 'https://qrcraft.studio';

  const options: Partial<Options> = {
    width: targetSize,
    height: targetSize,
    type: 'svg',
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

  const qr = new QRCodeStyling(options);
  const rawBlob = await qr.getRawData('svg');

  if (!rawBlob) {
    throw new Error('Falha ao gerar vetor SVG');
  }

  const rawText = await (rawBlob as Blob).text();

  // Sanitização e padronização para importação sem erros no Figma / Illustrator
  let cleanedSvg = rawText;
  if (!cleanedSvg.includes('viewBox')) {
    cleanedSvg = cleanedSvg.replace(
      '<svg ',
      `<svg viewBox="0 0 ${targetSize} ${targetSize}" `
    );
  }

  const cleanBlob = new Blob([cleanedSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(cleanBlob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `qrcraft-${payload.type}-vetorial.svg`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
