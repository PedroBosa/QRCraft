import { jsPDF } from 'jspdf';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { QRConfig } from '../../../types/qr';
import { PayloadData } from '../../../types/payload';
import { compilePayload } from '../../../core/builders';

export type PdfMode = 'display' | 'stickers';

interface GeneratePdfOptions {
  config: QRConfig;
  payload: PayloadData;
  mode: PdfMode;
  sheetTitle: string;
}

async function renderHighResDataUrl(
  config: QRConfig,
  payload: PayloadData,
  size = 1024
): Promise<string> {
  const scale = size / 320;
  const scaledMargin = Math.round(config.margin * scale);
  const scaledImageMargin = Math.round(config.imageOptions.margin * scale);
  const compiledData = compilePayload(payload) || 'https://qrcraft.studio';

  const options: Partial<Options> = {
    width: size,
    height: size,
    type: 'canvas',
    data: compiledData,
    margin: scaledMargin,
    qrOptions: { errorCorrectionLevel: config.errorCorrectionLevel },
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
  const blob = (await qr.getRawData('png')) as Blob;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function getPayloadDescription(payload: PayloadData): string {
  switch (payload.type) {
    case 'pix':
      return `Chave PIX: ${payload.merchantName || payload.pixKey}`;
    case 'wifi':
      return `Rede Wi-Fi: ${payload.ssid}`;
    case 'vcard':
      return `Contato: ${payload.firstName} ${payload.lastName}`;
    case 'url':
      return payload.rawUrl;
    case 'whatsapp':
      return `WhatsApp: ${payload.phoneNumber}`;
    case 'ical':
      return `Evento: ${payload.title}`;
    default:
      return '';
  }
}

export async function exportPdfSheet({
  config,
  payload,
  mode,
  sheetTitle,
}: GeneratePdfOptions): Promise<void> {
  // A4: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const qrDataUrl = await renderHighResDataUrl(config, payload, 1024);

  if (mode === 'display') {
    // MODO 1: PLACA / DISPLAY ÚNICO
    // Moldura decorativa
    doc.setDrawColor(79, 70, 229); // #4F46E5
    doc.setLineWidth(0.8);
    doc.roundedRect(15, 15, 180, 267, 4, 4);

    // Título Principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42);
    doc.text(sheetTitle || 'ESCANEIE COM A CÂMERA', 105, 45, { align: 'center' });

    // Subtítulo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text('Abra o aplicativo de câmera ou leitor de QR Code para acessar', 105, 55, {
      align: 'center',
    });

    // QR Code centralizado em 120x120mm
    doc.addImage(qrDataUrl, 'PNG', 45, 75, 120, 120);

    // Box de Resumo do Payload
    const summary = getPayloadDescription(payload);
    if (summary) {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(35, 210, 140, 18, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(summary, 105, 221, { align: 'center', maxWidth: 130 });
    }

    // Rodapé
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Gerado 100% Client-Side via QRCraft Studio', 105, 270, { align: 'center' });
  } else {
    // MODO 2: FOLHA DE ADESIVOS 3x4 (12 ETIQUETAS)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.text(sheetTitle || 'GRADE DE ADESIVOS GRÁFICOS', 105, 14, { align: 'center' });

    const cols = 3;
    const rows = 4;
    const qrSize = 45; // mm
    const startX = 20;
    const startY = 22;
    const gapX = 18;
    const gapY = 20;

    // Configuração das linhas guias de corte tracejadas
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (qrSize + gapX);
        const y = startY + r * (qrSize + gapY);

        // Guia de corte quadrada ao redor de cada etiqueta
        doc.rect(x - 3, y - 3, qrSize + 6, qrSize + 11);

        // Imagem do QR
        doc.addImage(qrDataUrl, 'PNG', x, y, qrSize, qrSize);

        // Micro label
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('Aponte a Câmera', x + qrSize / 2, y + qrSize + 4, { align: 'center' });
      }
    }
  }

  doc.save(`qrcraft-${mode === 'display' ? 'placa' : 'adesivos'}.pdf`);
}
