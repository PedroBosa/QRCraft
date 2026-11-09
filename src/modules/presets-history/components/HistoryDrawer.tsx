import React from 'react';
import { History, X, Trash2, ArrowUpRight, Calendar, Layers } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { HistoryItem } from '../../../types/presets';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose }) => {
  const history = useQrStore((state) => state.history);
  const clearHistory = useQrStore((state) => state.clearHistory);
  const restoreHistoryItem = useQrStore((state) => state.restoreHistoryItem);

  if (!isOpen) return null;

  const handleRestore = (item: HistoryItem) => {
    restoreHistoryItem(item);
    onClose();
  };

  const getPayloadSummary = (item: HistoryItem): string => {
    const { payload } = item;
    switch (payload.type) {
      case 'url':
        return payload.rawUrl || 'URL';
      case 'pix':
        return `PIX: ${payload.merchantName || payload.pixKey}`;
      case 'wifi':
        return `Wi-Fi: ${payload.ssid}`;
      case 'vcard':
        return `vCard: ${payload.firstName} ${payload.lastName}`;
      case 'whatsapp':
        return `WhatsApp: ${payload.phoneNumber}`;
      case 'ical':
        return `Evento: ${payload.title}`;
      default:
        return 'Código';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-border bg-card p-4 sm:p-6 shadow-2xl transition-all">
        {/* Header do Drawer */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary-hover">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Histórico de Gerações</h3>
              <p className="text-xs text-zinc-400">Últimos códigos salvos no seu navegador.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lista de Códigos Salvos */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <Layers className="h-10 w-10 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300">Nenhum código no histórico</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Clique no botão "Salvar no Histórico" no preview do QR Code para arquivar suas versões.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 hover:border-zinc-700 transition-colors"
              >
                {/* Miniatura do QR */}
                <img
                  src={item.previewDataUrl}
                  alt="Miniatura do QR"
                  className="h-14 w-14 shrink-0 rounded-lg bg-white p-1 object-contain shadow-sm"
                />

                {/* Dados do Item */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-hover border border-primary/30">
                      {item.payload.type}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {new Date(item.timestamp).toLocaleDateString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <span className="mt-1 truncate text-xs font-semibold text-zinc-200">
                    {getPayloadSummary(item)}
                  </span>
                  <span className="text-[10px] text-zinc-500 capitalize">
                    Estilo: {item.config.dotsOptions.type} • ECL {item.config.errorCorrectionLevel}
                  </span>
                </div>

                {/* Ação Restaurar */}
                <button
                  type="button"
                  onClick={() => handleRestore(item)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-primary hover:bg-primary/20 hover:text-white transition-all shadow-sm"
                  title="Restaurar este código no estúdio"
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Rodapé com Limpar Histórico */}
        {history.length > 0 && (
          <div className="border-t border-border/80 pt-4">
            <button
              type="button"
              onClick={clearHistory}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              <span>Limpar Histórico Local</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
