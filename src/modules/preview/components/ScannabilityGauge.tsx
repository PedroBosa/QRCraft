import React from 'react';
import { useQrStore } from '../../../store/useQrStore';

export const ScannabilityGauge: React.FC = () => {
  const scannability = useQrStore((state) => state.scannability);
  const { score, contrastRatio, logoCoverageRatio, maxSafeLogoRatio } = scannability;

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 border-t border-white/[0.06] bg-zinc-950/40 text-[10px] sm:text-[11px] font-mono">
      <div className="flex flex-col">
        <span className="text-zinc-500 uppercase text-[9px] tracking-wider truncate">Índice Óptico</span>
        <span className="mt-0.5 font-semibold text-zinc-200">{score}/100</span>
      </div>

      <div className="flex flex-col border-l border-white/[0.06] pl-2 sm:pl-3">
        <span className="text-zinc-500 uppercase text-[9px] tracking-wider truncate">Contraste</span>
        <span className="mt-0.5 font-semibold text-zinc-200">{contrastRatio}:1</span>
      </div>

      <div className="flex flex-col border-l border-white/[0.06] pl-2 sm:pl-3">
        <span className="text-zinc-500 uppercase text-[9px] tracking-wider truncate">Área Logo</span>
        <span className="mt-0.5 font-semibold text-zinc-200">
          {(logoCoverageRatio * 100).toFixed(0)}% / {(maxSafeLogoRatio * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
};
