import React from 'react';
import { Phone } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { WhatsAppPayload } from '../../../types/payload';

export const WhatsAppPayloadForm: React.FC = () => {
  const payload = useQrStore((state) => state.payload as WhatsAppPayload);
  const setPayload = useQrStore((state) => state.setPayload);

  const formatPhoneNumber = (val: string) => {
    const numbers = val.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPayload({ ...payload, phoneNumber: formatted });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Telefone e DDI */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          WhatsApp
        </label>
        <div className="flex gap-2">
          <div className="w-20">
            <input
              type="text"
              value={payload.countryCode || '+55'}
              onChange={(e) => setPayload({ ...payload, countryCode: e.target.value })}
              placeholder="+55"
              className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 px-2 text-center text-xs font-semibold text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
            />
          </div>
          <div className="relative flex flex-1 items-center">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" strokeWidth={1.75} />
            <input
              type="tel"
              value={payload.phoneNumber || ''}
              onChange={handlePhoneChange}
              placeholder="(11) 98765-4321"
              className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mensagem Pré-preenchida */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Mensagem Automática (Opcional)
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            {(payload.message || '').length} chars
          </span>
        </div>
        <textarea
          rows={3}
          value={payload.message || ''}
          onChange={(e) => setPayload({ ...payload, message: e.target.value })}
          placeholder="Olá! Gostaria de mais informações..."
          className="w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
