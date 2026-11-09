import React, { useState } from 'react';
import { Shapes, Palette, Eye, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { useQrStore } from '../../store/useQrStore';

import { ModuleStyleSelector } from './components/ModuleStyleSelector';
import { ColorPickerStudio } from './components/ColorPickerStudio';
import { EyeCustomizer } from './components/EyeCustomizer';
import { LogoUploader } from './components/LogoUploader';
import { TemplateGallery } from '../presets-history/components/TemplateGallery';

type StudioSection = 'modules' | 'colors' | 'eyes' | 'logo';

interface SectionTab {
  id: StudioSection;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: SectionTab[] = [
  { id: 'modules', label: 'Módulos', icon: Shapes },
  { id: 'colors', label: 'Cores', icon: Palette },
  { id: 'eyes', label: 'Olhos', icon: Eye },
  { id: 'logo', label: 'Logo', icon: ImageIcon },
];

export const DesignStudioContainer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<StudioSection>('modules');
  const resetConfig = useQrStore((state) => state.resetConfig);

  return (
    <div className="flex flex-col gap-4 p-3.5 sm:p-5">
      {/* Header com Reset */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 whitespace-nowrap">
          Personalização Visual
        </span>
        <button
          type="button"
          onClick={resetConfig}
          className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap shrink-0"
          title="Restaurar padrão"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>Resetar<span className="hidden sm:inline"> Padrão</span></span>
        </button>
      </div>

      {/* Preset Swatch Strip no topo do Estúdio */}
      <TemplateGallery />

      {/* Segmented Control de Seções de Design */}
      <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950/80 p-1">
        {SECTIONS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-[6px] py-1.5 text-xs font-medium transition-all border whitespace-nowrap ${
                isActive
                  ? 'border-white/[0.08] bg-zinc-800/90 text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? 'text-secondary-hover' : 'text-zinc-500'}`}
                strokeWidth={isActive ? 2 : 1.75}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Seção Ativa (Sem min-h artificial) */}
      <div className="pt-2">
        {activeSection === 'modules' && <ModuleStyleSelector />}
        {activeSection === 'colors' && <ColorPickerStudio />}
        {activeSection === 'eyes' && <EyeCustomizer />}
        {activeSection === 'logo' && <LogoUploader />}
      </div>
    </div>
  );
};
