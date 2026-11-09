import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { BookmarkPlus, Check, ChevronDown, ChevronUp, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { compilePayload } from '../../../core/builders';

export const QREngineRenderer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  const config = useQrStore((state) => state.config);
  const payload = useQrStore((state) => state.payload);
  const addToHistory = useQrStore((state) => state.addToHistory);
  const scannability = useQrStore((state) => state.scannability);

  const [isRendering, setIsRendering] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showIssues, setShowIssues] = useState(false);

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      type: 'canvas',
    });
    qrCodeInstance.current = qr;

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      qr.append(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    setIsRendering(true);
    const handler = setTimeout(() => {
      if (!qrCodeInstance.current) return;

      const compiledData = compilePayload(payload) || 'https://qrcraft.studio';

      const options: Partial<Options> = {
        data: compiledData,
        margin: config.margin,
        qrOptions: {
          errorCorrectionLevel: config.errorCorrectionLevel,
        },
        image: config.imageOptions.src || undefined,
        imageOptions: {
          hideBackgroundDots: config.imageOptions.hideBackgroundDots,
          imageSize: config.imageOptions.imageSize,
          margin: config.imageOptions.margin,
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

      qrCodeInstance.current.update(options);
      setIsRendering(false);
    }, 120);

    return () => clearTimeout(handler);
  }, [config, payload]);

  const handleSaveToHistory = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const previewDataUrl = canvas.toDataURL('image/png');
    addToHistory({
      payload,
      config,
      previewDataUrl,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const statusColor = {
    excellent: 'text-success border-success/30 bg-success/10',
    good: 'text-success-hover border-success-hover/30 bg-success-hover/10',
    warning: 'text-secondary-hover border-secondary/40 bg-secondary/10',
    critical: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  }[scannability.status];

  return (
    <div className="relative flex flex-col items-center p-3.5 sm:p-5">
      {/* Top Viewport Toolbar */}
      <div className="flex w-full items-center justify-between pb-3">
        {/* Termômetro Pill */}
        <button
          type="button"
          onClick={() => setShowIssues(!showIssues)}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium transition-all ${statusColor}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          <span>{scannability.score}/100</span>
          <span className="text-white/40">•</span>
          <span>{scannability.contrastRatio}:1</span>
          {scannability.issues.length > 0 && (
            <span className="ml-0.5 text-[10px]">
              {showIssues ? (
                <ChevronUp className="inline h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <ChevronDown className="inline h-3.5 w-3.5" strokeWidth={2} />
              )}
            </span>
          )}
        </button>

        {/* Botão de Histórico */}
        <button
          type="button"
          onClick={handleSaveToHistory}
          className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 text-[11px] font-medium text-zinc-300 hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white transition-colors"
          title="Salvar versão no histórico"
        >
          {isSaved ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} />
              <span className="text-success">Salvo</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} />
              <span>Salvar</span>
            </>
          )}
        </button>
      </div>

      {/* Drawer Colapsável de Alertas Ópticos */}
      {showIssues && scannability.issues.length > 0 && (
        <div className="mb-3 flex w-full flex-col gap-1.5 rounded-lg border border-white/[0.08] bg-zinc-950/90 p-2.5 text-xs">
          {scannability.issues.map((issue, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px]">
              {issue.severity === 'critical' ? (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" strokeWidth={1.75} />
              ) : issue.severity === 'warning' ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-secondary-hover" strokeWidth={1.75} />
              ) : (
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" strokeWidth={1.75} />
              )}
              <div className="flex flex-col">
                <span className="text-zinc-200">{issue.message}</span>
                <span className="text-zinc-500">{issue.suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Canvas Viewport Central com Grade Sutil */}
      <div
        className="relative flex items-center justify-center rounded-xl p-3 sm:p-6 bg-grid-subtle border border-white/[0.06] bg-zinc-950/60 shadow-inner overflow-hidden w-full min-h-[260px] sm:min-h-[310px]"
      >
        <div
          id="qr-canvas-container"
          ref={containerRef}
          className="qr-preview-canvas flex items-center justify-center rounded-lg shadow-2xl shadow-black/80 transition-opacity duration-200 max-w-full"
        />

        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};
