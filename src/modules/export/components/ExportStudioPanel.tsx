import React, { useState } from 'react';
import {
  Download,
  FileCode,
  Copy,
  Check,
  Printer,
  Loader2,
} from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import {
  exportRasterImage,
  copyQrImageToClipboard,
  ExportResolution,
} from '../engines/raster-exporter';
import { exportCleanSvg } from '../engines/svg-cleaner';
import { exportPdfSheet, PdfMode } from '../engines/pdf-sheet';

export const ExportStudioPanel: React.FC = () => {
  const config = useQrStore((state) => state.config);
  const payload = useQrStore((state) => state.payload);

  const [resolution, setResolution] = useState<ExportResolution>(1024);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Estados do Modal/Gaveta de PDF
  const [showPdfSection, setShowPdfSection] = useState(false);
  const [pdfMode, setPdfMode] = useState<PdfMode>('display');
  const [pdfTitle, setPdfTitle] = useState('ESCANEIE COM A CÂMERA');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleRasterExport = async (format: 'png' | 'webp') => {
    setIsExporting(true);
    try {
      await exportRasterImage(config, payload, resolution, format);
    } catch {
      alert('Erro ao exportar arquivo.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSvgExport = async () => {
    setIsExporting(true);
    try {
      await exportCleanSvg(config, payload);
    } catch {
      alert('Erro ao exportar vetor SVG.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    try {
      await copyQrImageToClipboard(config, payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Não foi possível copiar diretamente para a área de transferência.');
    }
  };

  const handlePdfGeneration = async () => {
    setIsGeneratingPdf(true);
    try {
      await exportPdfSheet({
        config,
        payload,
        mode: pdfMode,
        sheetTitle: pdfTitle,
      });
    } catch {
      alert('Erro ao gerar documento PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 p-3.5 sm:p-5">
      {/* Resolução Segmented Control */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 whitespace-nowrap">
          Resolução
        </span>
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950 p-1">
          {[
            { res: 1024, shortLabel: '1K', fullLabel: '1K • 1024px' },
            { res: 2048, shortLabel: '2K', fullLabel: '2K • 2048px' },
            { res: 4096, shortLabel: '4K', fullLabel: '4K • 4096px' },
          ].map((item) => (
            <button
              key={item.res}
              type="button"
              onClick={() => setResolution(item.res as ExportResolution)}
              className={`rounded-[6px] px-2 sm:px-2.5 py-1 text-xs font-mono font-medium transition-all border whitespace-nowrap ${
                resolution === item.res
                  ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className="sm:hidden">{item.shortLabel}</span>
              <span className="hidden sm:inline">{item.fullLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary CTA + Secondary Toolbar */}
      <div className="flex flex-col gap-2">
        {/* Linha 1: Botão Primário Destaque (Baixar PNG) */}
        <button
          type="button"
          disabled={isExporting}
          onClick={() => handleRasterExport('png')}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 text-xs font-semibold text-white shadow-lg shadow-primary/25 hover:opacity-95 transition-all disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span>Baixar PNG ({resolution}px)</span>
        </button>

        {/* Linha 2: Ações Secundárias */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          <button
            type="button"
            disabled={isExporting}
            onClick={handleSvgExport}
            className="flex h-8 items-center justify-center gap-1 sm:gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-1 sm:px-2 text-xs font-medium text-zinc-300 hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white transition-colors"
            title="Download SVG Vetorial"
          >
            <FileCode className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-accent-cyan" strokeWidth={1.75} />
            <span>SVG</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleRasterExport('webp')}
            className="flex h-8 items-center justify-center gap-1 sm:gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-1 sm:px-2 text-xs font-medium text-zinc-300 hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white transition-colors"
            title="Download WebP"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-secondary-hover" strokeWidth={1.75} />
            <span>WebP</span>
          </button>

          <button
            type="button"
            onClick={handleCopyClipboard}
            className="flex h-8 items-center justify-center gap-1 sm:gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-1 sm:px-2 text-xs font-medium text-zinc-300 hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white transition-colors"
            title="Copiar imagem para área de transferência"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-success" strokeWidth={2} />
            ) : (
              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-zinc-400" strokeWidth={1.75} />
            )}
            <span className={copied ? 'text-success' : ''}>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPdfSection(!showPdfSection)}
            className={`flex h-8 items-center justify-center gap-1 sm:gap-1.5 rounded-lg border transition-colors px-1 sm:px-2 text-xs font-medium ${
              showPdfSection
                ? 'border-primary/50 bg-primary/20 text-white'
                : 'border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white'
            }`}
            title="Folha A4 para Impressão"
          >
            <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-zinc-400" strokeWidth={1.75} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Gaveta de PDF para Impressão */}
      {showPdfSection && (
        <div className="flex flex-col gap-3 rounded-lg border border-white/[0.08] bg-zinc-950/70 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-300">Folha de Impressão PDF (A4)</span>
            <button
              type="button"
              onClick={() => setShowPdfSection(false)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              Fechar
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950 p-1">
            <button
              type="button"
              onClick={() => setPdfMode('display')}
              className={`flex-1 rounded-[6px] py-1.5 text-xs font-medium transition-all border ${
                pdfMode === 'display'
                  ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              Placa Única
            </button>
            <button
              type="button"
              onClick={() => setPdfMode('stickers')}
              className={`flex-1 rounded-[6px] py-1.5 text-xs font-medium transition-all border ${
                pdfMode === 'stickers'
                  ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              Grade 3x4 (12 Adesivos)
            </button>
          </div>

          <input
            type="text"
            value={pdfTitle}
            onChange={(e) => setPdfTitle(e.target.value)}
            placeholder="Título da folha"
            className="rounded border border-white/[0.08] bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-primary focus:outline-none"
          />

          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={handlePdfGeneration}
            className="flex h-8 items-center justify-center gap-1.5 rounded bg-white/[0.08] font-medium text-white hover:bg-white/[0.14] transition-colors disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Printer className="h-3.5 w-3.5" />}
            <span>Gerar Folha PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
