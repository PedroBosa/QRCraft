import React, { useState } from 'react';
import { ArrowLeftRight, Droplet, Sparkles } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { GradientType } from '../../../types/qr';

const SWATCHES = [
  { name: 'Índigo', hex: '#4F46E5' },
  { name: 'Roxo', hex: '#9D4EDD' },
  { name: 'Roxo Claro', hex: '#C77DFF' },
  { name: 'Verde Suave', hex: '#58DB91' },
  { name: 'Ciano', hex: '#22D3EE' },
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Preto Puro', hex: '#09090B' },
];

export const ColorPickerStudio: React.FC = () => {
  const config = useQrStore((state) => state.config);
  const setConfig = useQrStore((state) => state.setConfig);

  const [activeTarget, setActiveTarget] = useState<'dots' | 'background'>('dots');

  const isDots = activeTarget === 'dots';
  const targetConfig = isDots ? config.dotsOptions : config.backgroundOptions;
  const isGradientActive = Boolean(targetConfig.gradient);

  // Toggle entre Sólido e Gradiente
  const handleModeToggle = (enableGradient: boolean) => {
    setConfig((prev) => {
      if (isDots) {
        return {
          ...prev,
          dotsOptions: {
            ...prev.dotsOptions,
            gradient: enableGradient
              ? {
                  type: 'linear',
                  rotation: 0,
                  colorStops: [
                    { offset: 0, color: prev.dotsOptions.color || '#4F46E5' },
                    { offset: 1, color: '#9D4EDD' },
                  ],
                }
              : undefined,
          },
        };
      } else {
        return {
          ...prev,
          backgroundOptions: {
            ...prev.backgroundOptions,
            gradient: enableGradient
              ? {
                  type: 'linear',
                  rotation: 0,
                  colorStops: [
                    { offset: 0, color: prev.backgroundOptions.color || '#FFFFFF' },
                    { offset: 1, color: '#09090B' },
                  ],
                }
              : undefined,
          },
        };
      }
    });
  };

  // Atualização de cor sólida
  const handleSolidColorChange = (color: string) => {
    setConfig((prev) => {
      if (isDots) {
        return {
          ...prev,
          dotsOptions: { ...prev.dotsOptions, color, gradient: undefined },
        };
      }
      return {
        ...prev,
        backgroundOptions: { ...prev.backgroundOptions, color, gradient: undefined },
      };
    });
  };

  // Atualização dos colorStops do gradiente
  const handleGradientStopChange = (index: 0 | 1, color: string) => {
    setConfig((prev) => {
      const currentGrad = (isDots ? prev.dotsOptions.gradient : prev.backgroundOptions.gradient) || {
        type: 'linear',
        rotation: 0,
        colorStops: [
          { offset: 0, color: '#4F46E5' },
          { offset: 1, color: '#9D4EDD' },
        ],
      };

      const newStops = [...currentGrad.colorStops];
      newStops[index] = { ...newStops[index], color };

      if (isDots) {
        return {
          ...prev,
          dotsOptions: {
            ...prev.dotsOptions,
            gradient: { ...currentGrad, colorStops: newStops },
          },
        };
      }
      return {
        ...prev,
        backgroundOptions: {
          ...prev.backgroundOptions,
          gradient: { ...currentGrad, colorStops: newStops },
        },
      };
    });
  };

  // Inverter Stops do Gradiente
  const handleSwapStops = () => {
    setConfig((prev) => {
      const grad = isDots ? prev.dotsOptions.gradient : prev.backgroundOptions.gradient;
      if (!grad || grad.colorStops.length < 2) return prev;

      const swappedStops = [
        { offset: 0, color: grad.colorStops[1].color },
        { offset: 1, color: grad.colorStops[0].color },
      ];

      if (isDots) {
        return {
          ...prev,
          dotsOptions: {
            ...prev.dotsOptions,
            gradient: { ...grad, colorStops: swappedStops },
          },
        };
      }
      return {
        ...prev,
        backgroundOptions: {
          ...prev.backgroundOptions,
          gradient: { ...grad, colorStops: swappedStops },
        },
      };
    });
  };

  // Tipo de Gradiente: linear vs radial
  const handleGradientTypeChange = (type: GradientType) => {
    setConfig((prev) => {
      const grad = isDots ? prev.dotsOptions.gradient : prev.backgroundOptions.gradient;
      if (!grad) return prev;

      if (isDots) {
        return {
          ...prev,
          dotsOptions: {
            ...prev.dotsOptions,
            gradient: { ...grad, type },
          },
        };
      }
      return {
        ...prev,
        backgroundOptions: {
          ...prev.backgroundOptions,
          gradient: { ...grad, type },
        },
      };
    });
  };

  const currentRotationDeg = targetConfig.gradient
    ? Math.round((targetConfig.gradient.rotation * 180) / Math.PI)
    : 0;

  const handleRotationChange = (degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    setConfig((prev) => {
      const grad = isDots ? prev.dotsOptions.gradient : prev.backgroundOptions.gradient;
      if (!grad) return prev;

      if (isDots) {
        return {
          ...prev,
          dotsOptions: {
            ...prev.dotsOptions,
            gradient: { ...grad, rotation: radians },
          },
        };
      }
      return {
        ...prev,
        backgroundOptions: {
          ...prev.backgroundOptions,
          gradient: { ...grad, rotation: radians },
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Segmented Control: Módulos vs Fundo */}
      <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950/80 p-1">
        <button
          type="button"
          onClick={() => setActiveTarget('dots')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-[6px] py-1.5 text-xs font-medium transition-all border ${
            isDots
              ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          }`}
        >
          <Droplet className="h-4 w-4" strokeWidth={1.75} />
          <span>Módulos (Pontos)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTarget('background')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-[6px] py-1.5 text-xs font-medium transition-all border ${
            !isDots
              ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          }`}
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          <span>Fundo</span>
        </button>
      </div>

      {/* Tipo de Preenchimento: Sólido vs Gradiente */}
      <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-zinc-950/40 px-3 py-2">
        <span className="text-xs font-medium text-zinc-400">Preenchimento</span>
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950 p-1">
          <button
            type="button"
            onClick={() => handleModeToggle(false)}
            className={`rounded-[6px] px-3 py-1 text-xs font-medium transition-all border ${
              !isGradientActive
                ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            Sólido
          </button>
          <button
            type="button"
            onClick={() => handleModeToggle(true)}
            className={`rounded-[6px] px-3 py-1 text-xs font-medium transition-all border ${
              isGradientActive
                ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            Gradiente
          </button>
        </div>
      </div>

      {/* Cor Sólida */}
      {!isGradientActive && (
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2">
            <input
              type="color"
              value={targetConfig.color || '#4F46E5'}
              onChange={(e) => handleSolidColorChange(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border border-white/[0.1] bg-zinc-950 p-0.5"
            />
            <input
              type="text"
              value={targetConfig.color || '#4F46E5'}
              onChange={(e) => handleSolidColorChange(e.target.value)}
              className="h-8 w-24 rounded border border-white/[0.08] bg-zinc-950 px-2 font-mono text-xs text-zinc-100 uppercase focus:border-primary/80 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Gradiente */}
      {isGradientActive && targetConfig.gradient && (
        <div className="flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-zinc-950/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Color Stops
            </span>
            <div className="flex items-center gap-1 rounded-md bg-zinc-950 p-1 border border-white/[0.06]">
              {(['linear', 'radial'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleGradientTypeChange(type)}
                  className={`rounded-[4px] px-2.5 py-0.5 text-[11px] font-medium capitalize transition-all border ${
                    targetConfig.gradient?.type === type
                      ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={targetConfig.gradient.colorStops[0]?.color || '#4F46E5'}
                onChange={(e) => handleGradientStopChange(0, e.target.value)}
                className="h-7 w-8 cursor-pointer rounded border border-white/[0.1] bg-zinc-950 p-0.5"
              />
              <span className="font-mono text-xs text-zinc-300 uppercase">
                {targetConfig.gradient.colorStops[0]?.color}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSwapStops}
              className="rounded border border-white/[0.08] bg-zinc-900 p-1.5 text-zinc-400 hover:text-white transition-colors"
              title="Inverter cores"
            >
              <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={targetConfig.gradient.colorStops[1]?.color || '#9D4EDD'}
                onChange={(e) => handleGradientStopChange(1, e.target.value)}
                className="h-7 w-8 cursor-pointer rounded border border-white/[0.1] bg-zinc-950 p-0.5"
              />
              <span className="font-mono text-xs text-zinc-300 uppercase">
                {targetConfig.gradient.colorStops[1]?.color}
              </span>
            </div>
          </div>

          {targetConfig.gradient.type === 'linear' && (
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
              <span className="text-[11px] text-zinc-400">Ângulo</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={currentRotationDeg}
                  onChange={(e) => handleRotationChange(Number(e.target.value))}
                  className="h-1.5 w-28 cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-primary"
                />
                <span className="w-8 text-right font-mono text-xs text-zinc-300">{currentRotationDeg}°</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Swatches Rápidas */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Paleta:
        </span>
        <div className="flex items-center gap-1.5">
          {SWATCHES.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => {
                if (isGradientActive) {
                  handleGradientStopChange(0, swatch.hex);
                } else {
                  handleSolidColorChange(swatch.hex);
                }
              }}
              style={{ backgroundColor: swatch.hex }}
              className="h-5 w-5 rounded-full border border-white/20 transition-transform hover:scale-110 shadow-sm"
              title={`${swatch.name} (${swatch.hex})`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
