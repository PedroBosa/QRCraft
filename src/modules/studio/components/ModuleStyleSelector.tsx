import React from 'react';
import { useQrStore } from '../../../store/useQrStore';
import { DotType, ErrorCorrectionLevel } from '../../../types/qr';

interface DotOption {
  id: DotType;
  label: string;
  previewSvg: React.ReactNode;
}

const DOT_OPTIONS: DotOption[] = [
  {
    id: 'square',
    label: 'Quadrado',
    previewSvg: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <rect x="3" y="3" width="8" height="8" />
        <rect x="13" y="3" width="8" height="8" />
        <rect x="3" y="13" width="8" height="8" />
        <rect x="13" y="13" width="8" height="8" />
      </svg>
    ),
  },
  {
    id: 'dots',
    label: 'Pontos',
    previewSvg: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <circle cx="7" cy="7" r="4" />
        <circle cx="17" cy="7" r="4" />
        <circle cx="7" cy="17" r="4" />
        <circle cx="17" cy="17" r="4" />
      </svg>
    ),
  },
  {
    id: 'rounded',
    label: 'Arredondado',
    previewSvg: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <rect x="3" y="3" width="8" height="8" rx="2.5" />
        <rect x="13" y="3" width="8" height="8" rx="2.5" />
        <rect x="3" y="13" width="8" height="8" rx="2.5" />
        <rect x="13" y="13" width="8" height="8" rx="2.5" />
      </svg>
    ),
  },
  {
    id: 'extra-rounded',
    label: 'Pílula',
    previewSvg: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <rect x="3" y="3" width="8" height="8" rx="4" />
        <rect x="13" y="3" width="8" height="8" rx="4" />
        <rect x="3" y="13" width="8" height="8" rx="4" />
        <rect x="13" y="13" width="8" height="8" rx="4" />
      </svg>
    ),
  },
  {
    id: 'classy',
    label: 'Classy',
    previewSvg: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M3 7a4 4 0 0 1 4-4h4v8H3V7z" />
        <path d="M13 3h4a4 4 0 0 1 4 4v4h-8V3z" />
        <path d="M3 13h8v8H7a4 4 0 0 1-4-4v-4z" />
        <rect x="13" y="13" width="8" height="8" />
      </svg>
    ),
  },
  {
    id: 'classy-rounded',
    label: 'Classy Suave',
    previewSvg: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <rect x="3" y="3" width="8" height="8" rx="2.5" />
        <circle cx="17" cy="7" r="4" />
        <circle cx="7" cy="17" r="4" />
        <rect x="13" y="13" width="8" height="8" rx="2.5" />
      </svg>
    ),
  },
];

const ECL_OPTIONS: Array<{ id: ErrorCorrectionLevel; label: string; pct: string }> = [
  { id: 'L', label: 'L', pct: '7%' },
  { id: 'M', label: 'M', pct: '15%' },
  { id: 'Q', label: 'Q', pct: '25%' },
  { id: 'H', label: 'H', pct: '30%' },
];

export const ModuleStyleSelector: React.FC = () => {
  const config = useQrStore((state) => state.config);
  const setConfig = useQrStore((state) => state.setConfig);

  const handleDotTypeChange = (type: DotType) => {
    setConfig((prev) => ({
      ...prev,
      dotsOptions: {
        ...prev.dotsOptions,
        type,
      },
    }));
  };

  const handleMarginChange = (margin: number) => {
    setConfig((prev) => ({
      ...prev,
      margin,
    }));
  };

  const handleECLChange = (errorCorrectionLevel: ErrorCorrectionLevel) => {
    setConfig((prev) => ({
      ...prev,
      errorCorrectionLevel,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Grid de Formas dos Módulos */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Formato dos Módulos
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {DOT_OPTIONS.map((opt) => {
            const isSelected = config.dotsOptions.type === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleDotTypeChange(opt.id)}
                className={`group flex flex-col items-center justify-center gap-2 rounded-lg py-3 px-2 transition-all border ${
                  isSelected
                    ? 'border-white/[0.2] bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10'
                    : 'border-white/[0.06] bg-zinc-950/60 text-zinc-400 hover:border-white/[0.12] hover:bg-zinc-900/60 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`transition-colors ${
                    isSelected ? 'text-primary-hover' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {opt.previewSvg}
                </div>
                <span className="text-[11px] font-medium leading-none">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Margem do QR Code */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-zinc-950/40 px-3 py-2">
        <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">Quiet Zone (Margem)</span>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="range"
            min="0"
            max="40"
            step="2"
            value={config.margin}
            onChange={(e) => handleMarginChange(Number(e.target.value))}
            className="h-1.5 w-24 sm:w-32 cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-primary"
          />
          <span className="w-8 text-right font-mono text-xs text-zinc-300">{config.margin}px</span>
        </div>
      </div>

      {/* Correção de Erro (ECL) em Segmented Control Responsivo */}
      <div className="flex flex-col gap-2 rounded-lg border border-white/[0.06] bg-zinc-950/40 p-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:py-2">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-zinc-400">Correção de Erro (ECL)</span>
          <span className="text-[10px] text-zinc-500">Capacidade de redundância óptica</span>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950 p-1">
          {ECL_OPTIONS.map((opt) => {
            const isSelected = config.errorCorrectionLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleECLChange(opt.id)}
                className={`flex flex-1 sm:flex-initial items-center justify-center gap-1 rounded-[6px] px-2.5 py-1 text-xs font-mono font-medium transition-all border whitespace-nowrap ${
                  isSelected
                    ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
                title={`Nível ${opt.label} (${opt.pct} de tolerância)`}
              >
                <span>{opt.label}</span>
                <span className="text-[10px] text-zinc-500">({opt.pct})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
