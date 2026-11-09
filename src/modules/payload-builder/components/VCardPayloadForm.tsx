import React from 'react';
import { useQrStore } from '../../../store/useQrStore';
import { VCardPayload } from '../../../types/payload';

export const VCardPayloadForm: React.FC = () => {
  const payload = useQrStore((state) => state.payload as VCardPayload);
  const setPayload = useQrStore((state) => state.setPayload);

  const updateAddress = (key: keyof NonNullable<VCardPayload['address']>, value: string) => {
    setPayload({
      ...payload,
      address: {
        ...(payload.address || {}),
        [key]: value,
      },
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Nome e Sobrenome */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Nome</label>
          <input
            type="text"
            value={payload.firstName || ''}
            onChange={(e) => setPayload({ ...payload, firstName: e.target.value })}
            placeholder="João"
            className="h-8 rounded border border-white/[0.08] bg-zinc-950/80 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Sobrenome</label>
          <input
            type="text"
            value={payload.lastName || ''}
            onChange={(e) => setPayload({ ...payload, lastName: e.target.value })}
            placeholder="Silva"
            className="h-8 rounded border border-white/[0.08] bg-zinc-950/80 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
      </div>

      {/* Empresa e Cargo */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Empresa</label>
          <input
            type="text"
            value={payload.organization || ''}
            onChange={(e) => setPayload({ ...payload, organization: e.target.value })}
            placeholder="Tech Corp"
            className="h-8 rounded border border-white/[0.08] bg-zinc-950/80 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Cargo</label>
          <input
            type="text"
            value={payload.title || ''}
            onChange={(e) => setPayload({ ...payload, title: e.target.value })}
            placeholder="Engenheiro"
            className="h-8 rounded border border-white/[0.08] bg-zinc-950/80 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
      </div>

      {/* Telefones */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Celular</label>
          <input
            type="tel"
            value={payload.phoneCell || ''}
            onChange={(e) => setPayload({ ...payload, phoneCell: e.target.value })}
            placeholder="+55 11 99999-9999"
            className="h-8 rounded border border-white/[0.08] bg-zinc-950/80 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Comercial</label>
          <input
            type="tel"
            value={payload.phoneWork || ''}
            onChange={(e) => setPayload({ ...payload, phoneWork: e.target.value })}
            placeholder="+55 11 3333-3333"
            className="h-8 rounded border border-white/[0.08] bg-zinc-950/80 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
      </div>

      {/* E-mail e Website */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">E-mail</label>
          <input
            type="email"
            value={payload.email || ''}
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
            placeholder="joao@empresa.com"
            className="h-8 rounded border border-white/[0.08] bg-zinc-950/80 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Website</label>
          <input
            type="url"
            value={payload.url || ''}
            onChange={(e) => setPayload({ ...payload, url: e.target.value })}
            placeholder="https://joaosilva.dev"
            className="h-8 rounded border border-white/[0.08] bg-zinc-950/80 px-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="rounded-lg border border-white/[0.06] bg-zinc-950/30 p-2.5 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Endereço (Opcional)
        </span>
        <input
          type="text"
          placeholder="Rua, Número e Bairro"
          value={payload.address?.street || ''}
          onChange={(e) => updateAddress('street', e.target.value)}
          className="h-7 w-full rounded border border-white/[0.08] bg-zinc-950 px-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-primary focus:outline-none"
        />
        <div className="grid grid-cols-3 gap-1.5">
          <input
            type="text"
            placeholder="Cidade"
            value={payload.address?.city || ''}
            onChange={(e) => updateAddress('city', e.target.value)}
            className="h-7 rounded border border-white/[0.08] bg-zinc-950 px-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-primary focus:outline-none"
          />
          <input
            type="text"
            placeholder="UF"
            value={payload.address?.state || ''}
            onChange={(e) => updateAddress('state', e.target.value)}
            className="h-7 rounded border border-white/[0.08] bg-zinc-950 px-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-primary focus:outline-none"
          />
          <input
            type="text"
            placeholder="CEP"
            value={payload.address?.zip || ''}
            onChange={(e) => updateAddress('zip', e.target.value)}
            className="h-7 rounded border border-white/[0.08] bg-zinc-950 px-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
