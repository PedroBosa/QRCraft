import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { CornerSquareType, CornerDotType } from '../../../types/qr';

export const EyeCustomizer: React.FC = () => {
  const config = useQrStore((state) => state.config);
  const setConfig = useQrStore((state) => state.setConfig);

  const handleOuterShapeChange = (type: CornerSquareType) => {
    setConfig((prev) => ({
      ...prev,
      cornersSquareOptions: {
        ...prev.cornersSquareOptions,
        type,
      },
    }));
  };

  const handleInnerShapeChange = (type: CornerDotType) => {
    setConfig((prev) => ({
      ...prev,
      cornersDotOptions: {
        ...prev.cornersDotOptions,
        type,
      },
    }));
  };

  const handleOuterColorChange = (color: string) => {
    setConfig((prev) => ({
      ...prev,
      cornersSquareOptions: {
        ...prev.cornersSquareOptions,
        color,
      },
    }));
  };

  const handleInnerColorChange = (color: string) => {
    setConfig((prev) => ({
      ...prev,
      cornersDotOptions: {
        ...prev.cornersDotOptions,
        color,
      },
    }));
  };

  const syncWithDotsColor = () => {
    const dotsColor = config.dotsOptions.color || '#4F46E5';
    setConfig((prev) => ({
      ...prev,
      cornersSquareOptions: {
        ...prev.cornersSquareOptions,
        color: dotsColor,
      },
      cornersDotOptions: {
        ...prev.cornersDotOptions,
        color: dotsColor,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Borda Externa Responsiva */}
      <div className="flex flex-col gap-2 rounded-lg border border-white/[0.06] bg-zinc-950/40 p-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:py-2">
        <span className="text-xs font-medium text-zinc-400">Borda Externa</span>
        <div className="flex w-full sm:w-auto items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950 p-1">
          {[
            {
              id: 'square',
              label: 'Quadrada',
              icon: (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0">
                  <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              ),
            },
            {
              id: 'extra-rounded',
              label: 'Arredondada',
              icon: (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0">
                  <rect x="2" y="2" width="12" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              ),
            },
            {
              id: 'dot',
              label: 'Circular',
              icon: (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0">
                  <circle cx="8" cy="8" r="5.75" fill="none" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              ),
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOuterShapeChange(item.id as CornerSquareType)}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-[6px] px-2.5 py-1 text-xs font-medium transition-all border whitespace-nowrap ${
                config.cornersSquareOptions.type === item.id
                  ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Miolo Interno Responsivo */}
      <div className="flex flex-col gap-2 rounded-lg border border-white/[0.06] bg-zinc-950/40 p-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:py-2">
        <span className="text-xs font-medium text-zinc-400">Miolo Interno</span>
        <div className="flex w-full sm:w-auto items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950 p-1">
          {[
            {
              id: 'square',
              label: 'Quadrado',
              icon: (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current shrink-0">
                  <rect x="3.5" y="3.5" width="9" height="9" />
                </svg>
              ),
            },
            {
              id: 'dot',
              label: 'Circular',
              icon: (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current shrink-0">
                  <circle cx="8" cy="8" r="4.75" />
                </svg>
              ),
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleInnerShapeChange(item.id as CornerDotType)}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-[6px] px-2.5 py-1 text-xs font-medium transition-all border whitespace-nowrap ${
                config.cornersDotOptions.type === item.id
                  ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cores dos Olhos Responsivas */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 pt-1">
        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-zinc-950/40 px-3 py-2">
          <span className="text-xs text-zinc-400">Cor Borda</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.cornersSquareOptions.color || '#9D4EDD'}
              onChange={(e) => handleOuterColorChange(e.target.value)}
              className="h-6 w-8 cursor-pointer rounded border border-white/[0.1] bg-zinc-950 p-0.5"
            />
            <span className="font-mono text-xs text-zinc-300 uppercase">
              {config.cornersSquareOptions.color}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-zinc-950/40 px-3 py-2">
          <span className="text-xs text-zinc-400">Cor Miolo</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.cornersDotOptions.color || '#4F46E5'}
              onChange={(e) => handleInnerColorChange(e.target.value)}
              className="h-6 w-8 cursor-pointer rounded border border-white/[0.1] bg-zinc-950 p-0.5"
            />
            <span className="font-mono text-xs text-zinc-300 uppercase">
              {config.cornersDotOptions.color}
            </span>
          </div>
        </div>
      </div>

      {/* Sincronizar */}
      <button
        type="button"
        onClick={syncWithDotsColor}
        className="flex h-8 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-zinc-300 hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white transition-colors"
      >
        <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
        <span>Sincronizar com as Cores dos Módulos</span>
      </button>
    </div>
  );
};
