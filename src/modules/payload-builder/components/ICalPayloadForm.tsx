import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { ICalPayload } from '../../../types/payload';

export const ICalPayloadForm: React.FC = () => {
  const payload = useQrStore((state) => state.payload as ICalPayload);
  const setPayload = useQrStore((state) => state.setPayload);

  return (
    <div className="flex flex-col gap-3">
      {/* Título do Evento */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Título do Evento
        </label>
        <div className="relative flex items-center">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={payload.title || ''}
            onChange={(e) => setPayload({ ...payload, title: e.target.value })}
            placeholder="Conferência de Tecnologia"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
      </div>

      {/* Datas: Início e Fim */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Início
          </label>
          <div className="relative flex items-center">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" strokeWidth={1.75} />
            <input
              type="datetime-local"
              value={payload.startDate || ''}
              onChange={(e) => setPayload({ ...payload, startDate: e.target.value })}
              className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-9 pr-2.5 text-xs text-zinc-100 focus:border-primary/80 focus:outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Término
          </label>
          <div className="relative flex items-center">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" strokeWidth={1.75} />
            <input
              type="datetime-local"
              value={payload.endDate || ''}
              onChange={(e) => setPayload({ ...payload, endDate: e.target.value })}
              className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-9 pr-2.5 text-xs text-zinc-100 focus:border-primary/80 focus:outline-none [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {/* Localização */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Local / Link
        </label>
        <div className="relative flex items-center">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={payload.location || ''}
            onChange={(e) => setPayload({ ...payload, location: e.target.value })}
            placeholder="Auditório Principal ou https://meet.google.com/xyz"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
      </div>

      {/* Descrição */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Detalhes
        </label>
        <textarea
          rows={2}
          value={payload.description || ''}
          onChange={(e) => setPayload({ ...payload, description: e.target.value })}
          placeholder="Pauta do evento e instruções..."
          className="w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
