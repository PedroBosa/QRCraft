import { QRConfig, ErrorCorrectionLevel } from '../../types/qr';
import { ScannabilityReport } from '../../types/scannability';
import { getContrastRatio, hexToRgb, getRelativeLuminance } from './luminance';

const ECL_MAX_SAFE_AREA: Record<ErrorCorrectionLevel, number> = {
  L: 0.07,
  M: 0.15,
  Q: 0.25,
  H: 0.30,
};

function extractColorList(singleColor: string, gradient?: QRConfig['dotsOptions']['gradient']): string[] {
  if (gradient && gradient.colorStops && gradient.colorStops.length > 0) {
    return gradient.colorStops.map((stop) => stop.color);
  }
  return [singleColor];
}

export function calculateScannability(config: QRConfig): ScannabilityReport {
  const issues: ScannabilityReport['issues'] = [];
  let score = 100;

  // 1. Extração de todas as cores para validação de gradientes
  const fgColors = extractColorList(config.dotsOptions.color, config.dotsOptions.gradient);
  const bgColors = extractColorList(config.backgroundOptions.color, config.backgroundOptions.gradient);

  let worstContrast = Number.POSITIVE_INFINITY;
  let hasInversionRisk = false;

  for (const fg of fgColors) {
    for (const bg of bgColors) {
      const contrast = getContrastRatio(fg, bg);
      if (contrast < worstContrast) {
        worstContrast = contrast;
      }

      const fgRgb = hexToRgb(fg);
      const bgRgb = hexToRgb(bg);
      const fgLum = getRelativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
      const bgLum = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

      if (fgLum > bgLum) {
        hasInversionRisk = true;
      }
    }
  }

  // 2. Penalidades por Contraste e Inversão
  if (hasInversionRisk) {
    score -= 30;
    issues.push({
      code: 'PATTERN_INVERTED',
      severity: 'warning',
      message: 'Gradiente ou cor com padrão invertido detectado (módulos claros sobre fundo escuro).',
      suggestion: 'Leitores ópticos legados podem falhar. Mantenha os módulos mais escuros que o fundo.',
    });
  }

  if (worstContrast < 3.0) {
    score -= 50;
    issues.push({
      code: 'CONTRAST_LOW',
      severity: 'critical',
      message: `Pior contraste do gradiente é crítico (${worstContrast.toFixed(1)}:1). Mínimo exigido: 4.5:1.`,
      suggestion: 'Ajuste os color stops do gradiente para garantir separação de luminosidade.',
    });
  } else if (worstContrast < 4.5) {
    score -= 20;
    issues.push({
      code: 'CONTRAST_LOW',
      severity: 'warning',
      message: `Pior contraste do gradiente é limítrofe (${worstContrast.toFixed(1)}:1).`,
      suggestion: 'Aumente o contraste dos pontos finais do gradiente para leitura sob luz solar.',
    });
  }

  // 3. Validação de Logo Central vs Error Correction Level
  const ecl = config.errorCorrectionLevel;
  const maxSafeRatio = ECL_MAX_SAFE_AREA[ecl];
  const imageSize = config.imageOptions.src ? config.imageOptions.imageSize : 0;
  const logoCoverage = imageSize * imageSize;

  if (config.imageOptions.src) {
    if (logoCoverage > maxSafeRatio) {
      const excess = (logoCoverage - maxSafeRatio) / maxSafeRatio;
      const penalty = Math.min(45, Math.round(excess * 40));
      score -= penalty;
      issues.push({
        code: 'LOGO_OVERSIZED',
        severity: 'critical',
        message: `Logo ocupa ${(logoCoverage * 100).toFixed(1)}% do código, excedendo os ${(maxSafeRatio * 100).toFixed(0)}% tolerados pelo nível ${ecl}.`,
        suggestion: `Reduza o tamanho da imagem ou aumente a correção de erro para 'H' (High).`,
      });
    }

    if (ecl === 'L' || ecl === 'M') {
      issues.push({
        code: 'ECL_MISMATCH',
        severity: 'warning',
        message: `Uso de logo central com nível de correção '${ecl}' não oferece redundância suficiente.`,
        suggestion: "Defina o nível de correção de erro como 'Q' (25%) ou 'H' (30%).",
      });
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));

  let status: ScannabilityReport['status'] = 'excellent';
  if (finalScore < 45) status = 'critical';
  else if (finalScore < 70) status = 'warning';
  else if (finalScore < 90) status = 'good';

  return {
    score: finalScore,
    status,
    contrastRatio: Number(worstContrast.toFixed(2)),
    logoCoverageRatio: Number(logoCoverage.toFixed(3)),
    maxSafeLogoRatio: maxSafeRatio,
    issues,
  };
}
