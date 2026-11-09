export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical';

export interface ScannabilityReport {
  score: number; // 0 a 100
  status: HealthStatus;
  contrastRatio: number;
  logoCoverageRatio: number;
  maxSafeLogoRatio: number;
  issues: Array<{
    code: 'CONTRAST_LOW' | 'LOGO_OVERSIZED' | 'ECL_MISMATCH' | 'PATTERN_INVERTED';
    severity: 'critical' | 'warning' | 'info';
    message: string;
    suggestion: string;
  }>;
}
