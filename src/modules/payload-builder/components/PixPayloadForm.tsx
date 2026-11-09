import React, { useState } from 'react';
import { Copy, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { PixPayload } from '../../../types/payload';
import { buildPixEMVPayload } from '../../../core/builders/emv-pix';

export const PixPayloadForm: React.FC = () => {
  const payload = useQrStore((state) => state.payload as PixPayload);
  const setPayload = useQrStore((state) => state.setPayload);
  const [copied, setCopied] = useState(false);

  const applyMask = (value: string, keyType: PixPayload['keyType']): string => {
    const numbersOnly = value.replace(/\D/g, '');

    if (keyType === 'cpf') {
      return numbersOnly
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    if (keyType === 'cnpj') {
      return numbersOnly
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    if (keyType === 'phone') {
      return numbersOnly
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d{4})$/, '$1-$2');
    }

    return value;
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = applyMask(rawVal, payload.keyType);
    setPayload({ ...payload, pixKey: formatted });
  };

  const handleKeyTypeChange = (type: PixPayload['keyType']) => {
    setPayload({
      ...payload,
      keyType: type,
      pixKey: '',
    });
  };

  const copyPixCode = () => {
    const brCode = buildPixEMVPayload(payload);
    navigator.clipboard.writeText(brCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Seletor Segmentado de Tipo de Chave */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Tipo de Chave
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950/80 p-1">
          {(['cpf', 'cnpj', 'phone', 'email', 'random'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleKeyTypeChange(type)}
              className={`flex-1 rounded-[6px] py-1.5 text-xs font-medium capitalize transition-all border ${
                payload.keyType === type
                  ? 'border-white/[0.08] bg-zinc-800/90 text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              {type === 'phone' ? 'Telefone' : type === 'random' ? 'EVP' : type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Input da Chave */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Chave PIX
        </label>
        <input
          type={payload.keyType === 'email' ? 'email' : 'text'}
          value={payload.pixKey || ''}
          onChange={handleKeyChange}
          placeholder={
            payload.keyType === 'cpf'
              ? '000.000.000-00'
              : payload.keyType === 'cnpj'
              ? '00.000.000/0000-00'
              : payload.keyType === 'phone'
              ? '(11) 98765-4321'
              : payload.keyType === 'email'
              ? 'pix@seudominio.com.br'
              : 'Chave EVP aleatória'
          }
          className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Grid: Nome do Recebedor e Cidade */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Nome do Recebedor
            </label>
            <span className="text-[10px] text-zinc-500 font-mono">
              {(payload.merchantName || '').length}/25
            </span>
          </div>
          <input
            type="text"
            maxLength={25}
            value={payload.merchantName || ''}
            onChange={(e) => setPayload({ ...payload, merchantName: e.target.value })}
            placeholder="Nome Completo ou Empresa"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Cidade
            </label>
            <span className="text-[10px] text-zinc-500 font-mono">
              {(payload.merchantCity || '').length}/15
            </span>
          </div>
          <input
            type="text"
            maxLength={15}
            value={payload.merchantCity || ''}
            onChange={(e) => setPayload({ ...payload, merchantCity: e.target.value })}
            placeholder="SAO PAULO"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid: Valor e TxID */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Valor R$ (Opcional)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-xs font-mono font-medium text-zinc-500 select-none">
              R$
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={payload.transactionAmount !== undefined ? payload.transactionAmount : ''}
              onChange={(e) =>
                setPayload({
                  ...payload,
                  transactionAmount: e.target.value !== '' ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="0,00"
              className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 pl-8 pr-7 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none focus:ring-1 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {/* Micro-steppers elegantes no padrão Dark SaaS */}
            <div className="absolute right-1 flex flex-col items-center justify-center border-l border-white/[0.06] pl-0.5">
              <button
                type="button"
                onClick={() => {
                  const current = payload.transactionAmount || 0;
                  setPayload({
                    ...payload,
                    transactionAmount: Number((current + 1).toFixed(2)),
                  });
                }}
                className="flex h-3.5 w-4 items-center justify-center rounded text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-200 transition-colors"
                title="Aumentar R$ 1,00"
              >
                <ChevronUp className="h-3 w-3" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = payload.transactionAmount || 0;
                  if (current > 0) {
                    setPayload({
                      ...payload,
                      transactionAmount: Math.max(0, Number((current - 1).toFixed(2))),
                    });
                  }
                }}
                className="flex h-3.5 w-4 items-center justify-center rounded text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-200 transition-colors"
                title="Diminuir R$ 1,00"
              >
                <ChevronDown className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Identificador (TxID)
          </label>
          <input
            type="text"
            maxLength={25}
            value={payload.txId || '***'}
            onChange={(e) => setPayload({ ...payload, txId: e.target.value })}
            placeholder="*** ou identificador"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-primary/80 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Copiar PIX Copia e Cola */}
      <button
        type="button"
        onClick={copyPixCode}
        className="mt-1 flex h-8 items-center justify-center gap-1.5 rounded-lg border border-success/30 bg-success/10 text-xs font-medium text-success hover:bg-success/20 transition-all shadow-sm"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" strokeWidth={2} />
            <span>Código Copiado</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" strokeWidth={1.75} />
            <span>Copiar Código PIX Copia e Cola</span>
          </>
        )}
      </button>
    </div>
  );
};
