import React, { useState } from 'react';
import {
  Link2,
  QrCode,
  Wifi,
  Contact,
  MessageCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import { useQrStore } from '../../store/useQrStore';
import { PayloadType } from '../../types/payload';
import { compilePayload } from '../../core/builders';

import { UrlPayloadForm } from './components/UrlPayloadForm';
import { PixPayloadForm } from './components/PixPayloadForm';
import { WifiPayloadForm } from './components/WifiPayloadForm';
import { VCardPayloadForm } from './components/VCardPayloadForm';
import { WhatsAppPayloadForm } from './components/WhatsAppPayloadForm';
import { ICalPayloadForm } from './components/ICalPayloadForm';

interface TabItem {
  id: PayloadType;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'url', label: 'URL', icon: Link2 },
  { id: 'pix', label: 'PIX', icon: QrCode },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'vcard', label: 'vCard', icon: Contact },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'ical', label: 'Evento', icon: Calendar },
];

export const PayloadBuilderContainer: React.FC = () => {
  const payload = useQrStore((state) => state.payload);
  const setPayload = useQrStore((state) => state.setPayload);

  const [showRawPayload, setShowRawPayload] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const activeTab = payload.type;
  const compiledString = compilePayload(payload);

  const handleTabChange = (type: PayloadType) => {
    if (type === payload.type) return;

    switch (type) {
      case 'url':
        setPayload({
          type: 'url',
          rawUrl: 'https://github.com',
          utmParams: {},
        });
        break;
      case 'pix':
        setPayload({
          type: 'pix',
          pixKey: '',
          keyType: 'cpf',
          merchantName: '',
          merchantCity: 'SAO PAULO',
          txId: '***',
        });
        break;
      case 'wifi':
        setPayload({
          type: 'wifi',
          ssid: '',
          encryption: 'WPA',
          hidden: false,
        });
        break;
      case 'vcard':
        setPayload({
          type: 'vcard',
          firstName: '',
          lastName: '',
        });
        break;
      case 'whatsapp':
        setPayload({
          type: 'whatsapp',
          countryCode: '+55',
          phoneNumber: '',
          message: '',
        });
        break;
      case 'ical': {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        setPayload({
          type: 'ical',
          title: '',
          startDate: now.toISOString().slice(0, 16),
          endDate: oneHourLater.toISOString().slice(0, 16),
        });
        break;
      }
    }
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(compiledString).then(() => {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4 p-3.5 sm:p-5">
      {/* Header Compacto com Segmented Control */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Tipo de Conteúdo
        </span>

        {/* Segmented Control Responsivo (Scroll horizontal suave no celular, flex-1 no desktop) */}
        <div className="flex w-full items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950/80 p-1 overflow-x-auto custom-scrollbar no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex shrink-0 sm:flex-1 items-center justify-center gap-1.5 rounded-[6px] px-3 sm:px-2 py-1.5 text-xs font-medium transition-all border whitespace-nowrap ${
                  isActive
                    ? 'border-white/[0.08] bg-zinc-800/90 text-white shadow-sm'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary-hover' : 'text-zinc-500'}`}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulário Ativo (Sem min-h artificial) */}
      <div className="py-1">
        {activeTab === 'url' && <UrlPayloadForm />}
        {activeTab === 'pix' && <PixPayloadForm />}
        {activeTab === 'wifi' && <WifiPayloadForm />}
        {activeTab === 'vcard' && <VCardPayloadForm />}
        {activeTab === 'whatsapp' && <WhatsAppPayloadForm />}
        {activeTab === 'ical' && <ICalPayloadForm />}
      </div>

      {/* Bar Compacta de Payload Bruto */}
      <div className="rounded-lg border border-white/[0.06] bg-zinc-950/60 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRawPayload(!showRawPayload)}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-zinc-200"
        >
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
            <span className="font-mono text-[11px]">Payload ({compiledString.length} chars)</span>
          </div>
          {showRawPayload ? (
            <ChevronUp className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
          )}
        </button>

        {showRawPayload && (
          <div className="border-t border-white/[0.06] p-3">
            <div className="relative">
              <pre className="max-h-24 overflow-auto rounded bg-zinc-900/90 p-2.5 font-mono text-[11px] text-zinc-300 break-all whitespace-pre-wrap">
                {compiledString || '// Nenhum payload'}
              </pre>
              <button
                type="button"
                onClick={handleCopyRaw}
                className="absolute top-2 right-2 flex items-center gap-1.5 rounded border border-white/[0.1] bg-zinc-800/80 px-2 py-1 text-[10px] font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                {copiedRaw ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} />
                    <span className="text-success">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
