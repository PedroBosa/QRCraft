import React, { useRef, useState } from 'react';
import { Plus, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';

export const TemplateGallery: React.FC = () => {
  const presets = useQrStore((state) => state.presets);
  const activePresetId = useQrStore((state) => state.activePresetId);
  const applyPreset = useQrStore((state) => state.applyPreset);
  const saveCurrentAsPreset = useQrStore((state) => state.saveCurrentAsPreset);
  const deletePreset = useQrStore((state) => state.deletePreset);

  const [isCreating, setIsCreating] = useState(false);
  const [presetName, setPresetName] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) return;

    saveCurrentAsPreset(presetName.trim(), 'Personalizado');
    setPresetName('');
    setIsCreating(false);
  };

  // Suporte a scroll com a roda do mouse (horizontal wheel scroll)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && e.deltaY !== 0) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Navegação suave por botões
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-zinc-950/40 p-3">
      {/* Header Padronizado Responsivo */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 whitespace-nowrap">
            Presets<span className="hidden sm:inline"> de Estilo</span>
          </span>
          <span className="rounded border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.2 font-mono text-[9px] font-medium text-zinc-500">
            {presets.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Micro-controles de navegação do scroll */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="flex h-5 w-5 items-center justify-center rounded text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200 transition-colors"
              title="Rolar para esquerda"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="flex h-5 w-5 items-center justify-center rounded text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200 transition-colors"
              title="Rolar para direita"
            >
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="h-3 w-[1px] bg-white/[0.08]" />

          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1 text-[11px] font-medium text-primary-hover hover:text-white transition-colors whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span>Novo<span className="hidden sm:inline"> Preset</span></span>
          </button>
        </div>
      </div>

      {/* Trilho de Presets com Scroll Padronizado */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 custom-scrollbar scroll-smooth"
        >
          {presets.map((preset) => {
            const isActive = activePresetId === preset.id;
            const dotsColor = preset.config.dotsOptions.gradient
              ? preset.config.dotsOptions.gradient.colorStops[0]?.color
              : preset.config.dotsOptions.color;
            const bgColor = preset.config.backgroundOptions.color;

            return (
              <div
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`group flex h-7 shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-2.5 transition-all text-xs font-medium select-none ${
                  isActive
                    ? 'border-white/[0.22] bg-white/[0.09] text-white shadow-sm ring-1 ring-white/10'
                    : 'border-white/[0.06] bg-zinc-950/70 text-zinc-400 hover:border-white/[0.14] hover:bg-zinc-900/90 hover:text-zinc-200'
                }`}
              >
                {/* Twin Swatch Preview (Dots / Fundo) - Pixel-aligned integer scaling */}
                <div
                  className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/20 shadow-inner"
                  style={{ backgroundColor: bgColor }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: dotsColor }}
                  />
                </div>

                <span className="whitespace-nowrap">{preset.name}</span>

                {preset.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 -mr-1 rounded p-0.5 text-zinc-500 hover:text-rose-400 transition-opacity"
                    title="Excluir preset"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Form Popover Inline para Novo Preset */}
      {isCreating && (
        <form
          onSubmit={handleSavePreset}
          className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-900/90 p-2 mt-1"
        >
          <input
            type="text"
            required
            autoFocus
            placeholder="Nome do Preset (ex: Brand Dark)"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="flex-1 rounded border border-white/[0.08] bg-zinc-950 px-2.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-7 items-center gap-1 rounded bg-primary px-2.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            <Check className="h-3 w-3" />
            <span>Salvar</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </form>
      )}
    </div>
  );
};
