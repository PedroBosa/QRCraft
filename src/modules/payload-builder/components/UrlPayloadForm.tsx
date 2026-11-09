import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Link, Tag } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { UrlPayload } from '../../../types/payload';

export const UrlPayloadForm: React.FC = () => {
  const payload = useQrStore((state) => state.payload as UrlPayload);
  const setPayload = useQrStore((state) => state.setPayload);
  const [showUtm, setShowUtm] = useState(false);

  const updateRawUrl = (url: string) => {
    setPayload({
      ...payload,
      rawUrl: url,
    });
  };

  const updateUtm = (key: keyof NonNullable<UrlPayload['utmParams']>, value: string) => {
    setPayload({
      ...payload,
      utmParams: {
        ...(payload.utmParams || {}),
        [key]: value,
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Campo da URL Principal */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          URL de Destino
        </label>
        <div className="relative flex items-center">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" strokeWidth={1.75} />
          <input
            type="url"
            value={payload.rawUrl || ''}
            onChange={(e) => updateRawUrl(e.target.value)}
            placeholder="https://exemplo.com.br/pagina"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 transition-colors focus:border-primary/80 focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Accordion Expansível de Rastreamento UTM */}
      <div className="rounded-lg border border-white/[0.06] bg-zinc-950/40">
        <button
          type="button"
          onClick={() => setShowUtm(!showUtm)}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-zinc-200"
        >
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-secondary-hover" strokeWidth={1.75} />
            <span>Parâmetros de Campanha (UTM)</span>
          </div>
          {showUtm ? (
            <ChevronUp className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
          )}
        </button>

        {showUtm && (
          <div className="grid grid-cols-1 gap-2.5 border-t border-white/[0.06] p-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-zinc-500">Origem (utm_source)</label>
              <input
                type="text"
                placeholder="instagram, newsletter"
                value={payload.utmParams?.source || ''}
                onChange={(e) => updateUtm('source', e.target.value)}
                className="h-8 rounded border border-white/[0.08] bg-zinc-950 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-zinc-500">Mídia (utm_medium)</label>
              <input
                type="text"
                placeholder="qrcode_panfleto, bio"
                value={payload.utmParams?.medium || ''}
                onChange={(e) => updateUtm('medium', e.target.value)}
                className="h-8 rounded border border-white/[0.08] bg-zinc-950 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-zinc-500">Campanha (utm_campaign)</label>
              <input
                type="text"
                placeholder="lancamento_verao"
                value={payload.utmParams?.campaign || ''}
                onChange={(e) => updateUtm('campaign', e.target.value)}
                className="h-8 rounded border border-white/[0.08] bg-zinc-950 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-zinc-500">Termo (utm_term)</label>
              <input
                type="text"
                placeholder="promocao_tech"
                value={payload.utmParams?.term || ''}
                onChange={(e) => updateUtm('term', e.target.value)}
                className="h-8 rounded border border-white/[0.08] bg-zinc-950 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[10px] font-medium text-zinc-500">Conteúdo (utm_content)</label>
              <input
                type="text"
                placeholder="banner_mesa_01"
                value={payload.utmParams?.content || ''}
                onChange={(e) => updateUtm('content', e.target.value)}
                className="h-8 rounded border border-white/[0.08] bg-zinc-950 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
