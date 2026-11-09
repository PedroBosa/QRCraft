import React, { useRef } from 'react';
import { UploadCloud, Trash2, AlertTriangle } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';

export const LogoUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = useQrStore((state) => state.config);
  const setConfig = useQrStore((state) => state.setConfig);
  const scannability = useQrStore((state) => state.scannability);

  const hasLogo = Boolean(config.imageOptions.src);
  const isOversized = scannability.logoCoverageRatio > scannability.maxSafeLogoRatio;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;

      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 256;
        let targetW = img.width;
        let targetH = img.height;

        if (targetW > MAX_DIM || targetH > MAX_DIM) {
          if (targetW > targetH) {
            targetH = Math.round((targetH * MAX_DIM) / targetW);
            targetW = MAX_DIM;
          } else {
            targetW = Math.round((targetW * MAX_DIM) / targetH);
            targetH = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, targetW, targetH);
          const optimizedDataUrl = canvas.toDataURL('image/png');

          setConfig((prev) => ({
            ...prev,
            imageOptions: {
              ...prev.imageOptions,
              src: optimizedDataUrl,
            },
          }));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setConfig((prev) => ({
      ...prev,
      imageOptions: {
        ...prev.imageOptions,
        src: undefined,
      },
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSizeChange = (imageSize: number) => {
    setConfig((prev) => ({
      ...prev,
      imageOptions: {
        ...prev.imageOptions,
        imageSize,
      },
    }));
  };

  const handleMarginChange = (margin: number) => {
    setConfig((prev) => ({
      ...prev,
      imageOptions: {
        ...prev.imageOptions,
        margin,
      },
    }));
  };

  const handleToggleHideDots = () => {
    setConfig((prev) => ({
      ...prev,
      imageOptions: {
        ...prev.imageOptions,
        hideBackgroundDots: !prev.imageOptions.hideBackgroundDots,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {!hasLogo ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.12] bg-zinc-950/40 p-6 text-center transition-all hover:border-white/[0.24] hover:bg-zinc-950/80"
        >
          <UploadCloud className="h-7 w-7 text-zinc-400 mb-2" strokeWidth={1.5} />
          <span className="text-xs font-semibold text-zinc-200">
            Upload de Imagem ou Logo Central
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5">PNG, SVG, WebP ou JPG (Auto 256px)</span>
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-zinc-950/60 p-2.5">
          <div className="flex items-center gap-2.5">
            <img
              src={config.imageOptions.src}
              alt="Logo"
              className="h-10 w-10 rounded object-contain bg-white/10 p-1 border border-white/10"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-200">Logo Carregada</span>
              <span className="text-[10px] text-zinc-500">Renderizada no centro</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveLogo}
            className="flex h-7 items-center gap-1.5 rounded border border-rose-500/30 bg-rose-500/10 px-2 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Remover</span>
          </button>
        </div>
      )}

      {hasLogo && (
        <div className="flex flex-col gap-3">
          {/* Escala */}
          <div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.06] bg-zinc-950/40 px-3 py-2">
            <span className="text-xs font-medium text-zinc-400">Escala da Logo</span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.10"
                max="0.35"
                step="0.01"
                value={config.imageOptions.imageSize}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="h-1.5 w-28 cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-primary"
              />
              <span className="w-8 text-right font-mono text-xs text-zinc-300">
                {Math.round(config.imageOptions.imageSize * 100)}%
              </span>
            </div>
          </div>

          {isOversized && (
            <div className="flex items-center gap-2 rounded-lg border border-secondary/40 bg-secondary/10 p-2 text-[11px] text-secondary-hover">
              <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span>
                Área excede o limite seguro do nível {config.errorCorrectionLevel}. Recomendado ECL 'H'.
              </span>
            </div>
          )}

          {/* Margem */}
          <div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.06] bg-zinc-950/40 px-3 py-2">
            <span className="text-xs font-medium text-zinc-400">Margem da Logo</span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={config.imageOptions.margin}
                onChange={(e) => handleMarginChange(Number(e.target.value))}
                className="h-1.5 w-28 cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-primary"
              />
              <span className="w-8 text-right font-mono text-xs text-zinc-300">
                {config.imageOptions.margin}px
              </span>
            </div>
          </div>

          {/* Limpar Fundo */}
          <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-zinc-950/40 px-3 py-2">
            <span className="text-xs font-medium text-zinc-400">Limpar Pontos sob a Logo</span>
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(config.imageOptions.hideBackgroundDots)}
              onClick={handleToggleHideDots}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 ring-1 ring-white/10 transition-colors duration-200 focus:outline-none ${
                config.imageOptions.hideBackgroundDots ? 'bg-primary' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                  config.imageOptions.hideBackgroundDots ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
