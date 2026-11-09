export type DotType = 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type GradientType = 'linear' | 'radial';

export interface ColorGradient {
  type: GradientType;
  rotation: number; // Em radianos
  colorStops: Array<{
    offset: number; // 0.0 a 1.0
    color: string;  // Hex ou rgba
  }>;
}

export interface EyeCustomization {
  outerShape: CornerSquareType;
  innerShape: CornerDotType;
  outerColor: string;
  innerColor: string;
}

export interface QRConfig {
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotsOptions: {
    type: DotType;
    color: string;
    gradient?: ColorGradient;
  };
  cornersSquareOptions: {
    type: CornerSquareType;
    color: string;
    gradient?: ColorGradient;
  };
  cornersDotOptions: {
    type: CornerDotType;
    color: string;
    gradient?: ColorGradient;
  };
  individualEyes?: {
    topLeft?: EyeCustomization;
    topRight?: EyeCustomization;
    bottomLeft?: EyeCustomization;
  };
  backgroundOptions: {
    color: string;
    gradient?: ColorGradient;
  };
  imageOptions: {
    src?: string;
    hideBackgroundDots: boolean;
    imageSize: number; // 0.1 a 0.35
    margin: number;
    crossOrigin?: 'anonymous';
  };
}
