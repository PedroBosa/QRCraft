import React, { useEffect, useState } from 'react';
import { Header } from '../shared/components/layout/Header';
import { StudioLayout } from '../shared/components/layout/StudioLayout';
import { QREngineRenderer } from '../modules/preview/components/QREngineRenderer';
import { ScannabilityGauge } from '../modules/preview/components/ScannabilityGauge';
import { ExportStudioPanel } from '../modules/export/components/ExportStudioPanel';
import { PayloadBuilderContainer } from '../modules/payload-builder/PayloadBuilderContainer';
import { DesignStudioContainer } from '../modules/studio/DesignStudioContainer';
import { HistoryDrawer } from '../modules/presets-history/components/HistoryDrawer';
import { CameraValidatorModal } from '../modules/preview/components/CameraValidatorModal';
import { useQrStore } from '../store/useQrStore';

export const App: React.FC = () => {
  const importFromUrlToken = useQrStore((state) => state.importFromUrlToken);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);

  // Leitura reativa de preset na URL (?preset=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetToken = params.get('preset');
    if (presetToken) {
      const success = importFromUrlToken(presetToken);
      if (success) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [importFromUrlToken]);

  // Coluna Esquerda: Superfície Unificada de Configuração & Design
  const LeftPanel = (
    <div className="rounded-xl border border-white/[0.08] bg-[#0D0D10] divide-y divide-white/[0.06] shadow-2xl shadow-black/60">
      <PayloadBuilderContainer />
      <DesignStudioContainer />
    </div>
  );

  // Coluna Direita: Inspector Dock Unificado
  const RightPanel = (
    <div className="rounded-xl border border-white/[0.08] bg-[#0D0D10] divide-y divide-white/[0.06] shadow-2xl shadow-black/60 overflow-hidden">
      <QREngineRenderer />
      <ScannabilityGauge />
      <ExportStudioPanel />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenValidator={() => setIsValidatorOpen(true)}
      />
      <StudioLayout leftPanel={LeftPanel} rightPanel={RightPanel} />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <CameraValidatorModal
        isOpen={isValidatorOpen}
        onClose={() => setIsValidatorOpen(false)}
      />
    </div>
  );
};

export default App;
