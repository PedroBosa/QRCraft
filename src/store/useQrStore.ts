import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QRConfig } from '../types/qr';
import { PayloadData } from '../types/payload';
import { HistoryItem, Preset } from '../types/presets';
import { ScannabilityReport } from '../types/scannability';
import { calculateScannability } from '../core/algorithms/scannability';

interface QrStudioState {
  // Estado do Payload
  payload: PayloadData;
  setPayload: (payload: PayloadData) => void;

  // Estado de Estilização do QR
  config: QRConfig;
  setConfig: (updater: Partial<QRConfig> | ((prev: QRConfig) => QRConfig | Partial<QRConfig>)) => void;
  resetConfig: () => void;

  // Diagnóstico de Escaneabilidade
  scannability: ScannabilityReport;

  // Histórico & Presets
  history: HistoryItem[];
  presets: Preset[];
  activePresetId: string | null;
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  restoreHistoryItem: (item: HistoryItem) => void;

  applyPreset: (preset: Preset) => void;
  saveCurrentAsPreset: (name: string, description: string) => void;
  deletePreset: (id: string) => void;

  // Compartilhamento via URL
  exportShareableUrl: () => string;
  importFromUrlToken: (token: string) => boolean;
}

const DEFAULT_CONFIG: QRConfig = {
  size: 1024,
  margin: 16,
  errorCorrectionLevel: 'Q',
  dotsOptions: {
    type: 'rounded',
    color: '#4F46E5',
    gradient: {
      type: 'linear',
      rotation: 0.785, // 45 graus
      colorStops: [
        { offset: 0, color: '#4F46E5' },
        { offset: 1, color: '#9D4EDD' },
      ],
    },
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#9D4EDD',
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#4F46E5',
  },
  backgroundOptions: {
    color: '#FFFFFF',
  },
  imageOptions: {
    src: undefined,
    hideBackgroundDots: true,
    imageSize: 0.2,
    margin: 8,
    crossOrigin: 'anonymous',
  },
};

const OFFICIAL_PRESETS: Preset[] = [
  {
    id: 'cyber-indigo',
    name: 'Cyber Indigo',
    description: 'Gradiente suave de Índigo e Roxo com cantos arredondados sobre fundo branco limpo.',
    config: { ...DEFAULT_CONFIG },
    isCustom: false,
  },
  {
    id: 'neon-purple',
    name: 'Neon Purple',
    description: 'Estética escura com módulos em Roxo Neon e cantos destacados.',
    config: {
      size: 1024,
      margin: 16,
      errorCorrectionLevel: 'Q',
      dotsOptions: {
        type: 'extra-rounded',
        color: '#9D4EDD',
        gradient: {
          type: 'linear',
          rotation: 0.5,
          colorStops: [
            { offset: 0, color: '#9D4EDD' },
            { offset: 1, color: '#C77DFF' },
          ],
        },
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: '#C77DFF',
      },
      cornersDotOptions: {
        type: 'square',
        color: '#9D4EDD',
      },
      backgroundOptions: {
        color: '#09090B',
      },
      imageOptions: {
        src: undefined,
        hideBackgroundDots: true,
        imageSize: 0.2,
        margin: 6,
        crossOrigin: 'anonymous',
      },
    },
    isCustom: false,
  },
  {
    id: 'emerald-mint',
    name: 'Emerald Mint',
    description: 'Padrão circular suave em Verde Suave sobre fundo escuro para alto contraste.',
    config: {
      size: 1024,
      margin: 18,
      errorCorrectionLevel: 'Q',
      dotsOptions: {
        type: 'dots',
        color: '#58DB91',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#58DB91' },
            { offset: 1, color: '#88E788' },
          ],
        },
      },
      cornersSquareOptions: {
        type: 'dot',
        color: '#88E788',
      },
      cornersDotOptions: {
        type: 'dot',
        color: '#58DB91',
      },
      backgroundOptions: {
        color: '#09090B',
      },
      imageOptions: {
        src: undefined,
        hideBackgroundDots: true,
        imageSize: 0.2,
        margin: 8,
        crossOrigin: 'anonymous',
      },
    },
    isCustom: false,
  },
  {
    id: 'cyan-matrix',
    name: 'Cyan Matrix',
    description: 'Módulos classy futuristas com transição do Ciano para Índigo.',
    config: {
      size: 1024,
      margin: 16,
      errorCorrectionLevel: 'H',
      dotsOptions: {
        type: 'classy',
        color: '#22D3EE',
        gradient: {
          type: 'linear',
          rotation: 1.2,
          colorStops: [
            { offset: 0, color: '#22D3EE' },
            { offset: 1, color: '#4F46E5' },
          ],
        },
      },
      cornersSquareOptions: {
        type: 'square',
        color: '#4F46E5',
      },
      cornersDotOptions: {
        type: 'square',
        color: '#22D3EE',
      },
      backgroundOptions: {
        color: '#09090B',
      },
      imageOptions: {
        src: undefined,
        hideBackgroundDots: true,
        imageSize: 0.22,
        margin: 6,
        crossOrigin: 'anonymous',
      },
    },
    isCustom: false,
  },
  {
    id: 'minimalist-dark',
    name: 'Minimalist Dark',
    description: 'Design purista monocromático em alta densidade com fundo escuro profundo.',
    config: {
      size: 1024,
      margin: 20,
      errorCorrectionLevel: 'M',
      dotsOptions: {
        type: 'square',
        color: '#FFFFFF',
      },
      cornersSquareOptions: {
        type: 'square',
        color: '#FFFFFF',
      },
      cornersDotOptions: {
        type: 'square',
        color: '#FFFFFF',
      },
      backgroundOptions: {
        color: '#09090B',
      },
      imageOptions: {
        src: undefined,
        hideBackgroundDots: true,
        imageSize: 0.18,
        margin: 6,
        crossOrigin: 'anonymous',
      },
    },
    isCustom: false,
  },
];

const DEFAULT_PAYLOAD: PayloadData = {
  type: 'url',
  rawUrl: 'https://github.com',
};

export const useQrStore = create<QrStudioState>()(
  persist(
    (set, get) => ({
      payload: DEFAULT_PAYLOAD,
      config: DEFAULT_CONFIG,
      scannability: calculateScannability(DEFAULT_CONFIG),
      history: [],
      presets: OFFICIAL_PRESETS,
      activePresetId: 'cyber-indigo',

      setPayload: (payload) => set({ payload }),

      setConfig: (updater) => {
        set((state) => {
          const nextConfig = typeof updater === 'function' ? updater(state.config) : { ...state.config, ...updater };
          const scannability = calculateScannability(nextConfig as QRConfig);
          return {
            config: nextConfig as QRConfig,
            scannability,
            activePresetId: null,
          };
        });
      },

      resetConfig: () => {
        set({
          config: DEFAULT_CONFIG,
          scannability: calculateScannability(DEFAULT_CONFIG),
          activePresetId: 'cyber-indigo',
        });
      },

      addToHistory: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        set((state) => ({
          history: [newItem, ...state.history.slice(0, 19)],
        }));
      },

      clearHistory: () => set({ history: [] }),

      restoreHistoryItem: (item) => {
        set({
          payload: item.payload,
          config: item.config,
          scannability: calculateScannability(item.config),
          activePresetId: null,
        });
      },

      applyPreset: (preset) => {
        set({
          config: preset.config,
          activePresetId: preset.id,
          scannability: calculateScannability(preset.config),
        });
      },

      saveCurrentAsPreset: (name, description) => {
        const newPreset: Preset = {
          id: crypto.randomUUID(),
          name,
          description,
          config: get().config,
          isCustom: true,
        };
        set((state) => ({
          presets: [...state.presets, newPreset],
          activePresetId: newPreset.id,
        }));
      },

      deletePreset: (id) => {
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id || !p.isCustom),
          activePresetId: state.activePresetId === id ? null : state.activePresetId,
        }));
      },

      exportShareableUrl: () => {
        const currentConfig = { ...get().config };

        // Otimização: Se a imagem em DataURL for pesada (>2000 chars), omitimos na URL
        if (
          currentConfig.imageOptions.src &&
          currentConfig.imageOptions.src.startsWith('data:') &&
          currentConfig.imageOptions.src.length > 2000
        ) {
          currentConfig.imageOptions = {
            ...currentConfig.imageOptions,
            src: undefined,
          };
        }

        const stateToSerialize = {
          c: currentConfig,
          p: get().payload,
        };

        const encoded = btoa(encodeURIComponent(JSON.stringify(stateToSerialize)));
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('preset', encoded);
        return url.toString();
      },

      importFromUrlToken: (token) => {
        try {
          const decoded = decodeURIComponent(atob(token));
          const parsed = JSON.parse(decoded);
          if (parsed.c) {
            set({
              config: parsed.c,
              payload: parsed.p || get().payload,
              scannability: calculateScannability(parsed.c),
              activePresetId: null,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'qrcraft-studio-storage-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        presets: state.presets.filter((p) => p.isCustom),
        config: state.config,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const customOnly = state.presets.filter((p) => p.isCustom);
          state.presets = [...OFFICIAL_PRESETS, ...customOnly];
        }
      },
    }
  )
);
