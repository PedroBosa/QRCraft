import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Wifi } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { WifiPayload } from '../../../types/payload';

export const WifiPayloadForm: React.FC = () => {
  const payload = useQrStore((state) => state.payload as WifiPayload);
  const setPayload = useQrStore((state) => state.setPayload);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* SSID da Rede */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Nome da Rede (SSID)
        </label>
        <div className="relative flex items-center">
          <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={payload.ssid || ''}
            onChange={(e) => setPayload({ ...payload, ssid: e.target.value })}
            placeholder="MinhaRede_5G"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Criptografia */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Criptografia
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950/80 p-1">
          {[
            { id: 'WPA', label: 'WPA / WPA2' },
            { id: 'WEP', label: 'WEP' },
            { id: 'nopass', label: 'Aberta' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setPayload({
                  ...payload,
                  encryption: item.id as WifiPayload['encryption'],
                  password: item.id === 'nopass' ? '' : payload.password,
                })
              }
              className={`flex-1 rounded-[6px] py-1.5 text-xs font-medium transition-all border ${
                payload.encryption === item.id
                  ? 'border-white/[0.08] bg-zinc-800/90 text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Senha */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Senha
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" strokeWidth={1.75} />
          <input
            type={showPassword ? 'text' : 'password'}
            disabled={payload.encryption === 'nopass'}
            value={payload.password || ''}
            onChange={(e) => setPayload({ ...payload, password: e.target.value })}
            placeholder={
              payload.encryption === 'nopass' ? 'Rede sem senha' : 'Senha de acesso'
            }
            className={`h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-9 pr-9 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none ${
              payload.encryption === 'nopass' ? 'cursor-not-allowed opacity-40' : ''
            }`}
          />
          {payload.encryption !== 'nopass' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Switch Oculta */}
      <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-zinc-950/40 px-3 py-2">
        <span className="text-xs font-medium text-zinc-400">Rede Oculta (Não transmite SSID)</span>
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(payload.hidden)}
          onClick={() => setPayload({ ...payload, hidden: !payload.hidden })}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 ring-1 ring-white/10 transition-colors duration-200 focus:outline-none ${
            payload.hidden ? 'bg-primary' : 'bg-zinc-800'
          }`}
        >
          <span
            className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
              payload.hidden ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
