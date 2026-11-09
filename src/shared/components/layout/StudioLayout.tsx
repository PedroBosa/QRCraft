import React from 'react';

interface StudioLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
      <div className="grid grid-cols-1 items-start gap-5 lg:gap-6 lg:grid-cols-12">
        {/* Painel Esquerdo: Área de Criação e Configuração */}
        <section className="flex flex-col gap-5 lg:gap-6 lg:col-span-7">
          {leftPanel}
        </section>

        {/* Painel Direito: Sticky Inspector */}
        <aside className="lg:sticky lg:top-20 flex flex-col gap-5 lg:gap-6 lg:col-span-5">
          {rightPanel}
        </aside>
      </div>
    </main>
  );
};
