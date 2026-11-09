import React, { useState } from 'react';
import { QrCode, Share2, Check, Github, History, Zap } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenValidator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, onOpenValidator }) => {
  const [copied, setCopied] = useState(false);
  const exportShareableUrl = useQrStore((state) => state.exportShareableUrl);
  const historyCount = useQrStore((state) => state.history.length);

  const handleShare = () => {
    const url = exportShareableUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary shadow-md shadow-primary/20 shrink-0">
            <QrCode className="h-4.5 w-4.5 text-white" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm font-semibold tracking-tight text-white">QRCraft</span>
            <span className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium text-zinc-400">
              STUDIO
            </span>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenValidator}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 sm:px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white"
            title="Diagnóstico Óptico"
          >
            <Zap className="h-4 w-4 text-accent-cyan shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">Diagnóstico</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 sm:px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white"
            title="Histórico Local"
          >
            <History className="h-4 w-4 text-secondary-hover shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">Histórico</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[9px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={handleShare}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 sm:px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white"
            title="Compartilhar Link"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success shrink-0" strokeWidth={2} />
                <span className="text-success font-medium">Link Copiado</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-zinc-400 shrink-0" strokeWidth={1.75} />
                <span className="hidden sm:inline">Compartilhar</span>
              </>
            )}
          </button>

          <div className="h-4 w-[1px] bg-white/[0.08] mx-0.5" />

          <a
            href="https://github.com/PedroBosa/QRCraft"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white"
            title="Ver no GitHub (Repositório Oficial)"
          >
            <Github className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </header>
  );
};
