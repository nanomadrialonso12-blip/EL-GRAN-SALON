
import React from 'react';
import { Tab } from '../types';

interface WorldMapProps {
  onNavigate: (tab: Tab) => void;
  t: any;
}

const WorldMap: React.FC<WorldMapProps> = ({ onNavigate, t }) => {
  const buildings = [
    { id: Tab.DASHBOARD, label: 'Bastión', icon: 'fort', x: '50%', y: '25%', desc: 'Sede' },
    { id: Tab.STUDY, label: 'Biblioteca', icon: 'auto_stories', x: '20%', y: '45%', desc: 'Saber' },
    { id: Tab.FITNESS, label: 'Armas', icon: 'exercise', x: '80%', y: '45%', desc: 'Poder' },
    { id: Tab.SOCIAL, label: 'Taberna', icon: 'sports_bar', x: '30%', y: '75%', desc: 'Aliados' },
    { id: Tab.SHOP, label: 'Tesoro', icon: 'payments', x: '70%', y: '75%', desc: 'Botín' },
  ];

  return (
    <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-full md:min-h-[850px] parchment-texture rounded-lg overflow-hidden border-[15px] md:border-[40px] border-mahogany shadow-2xl flex items-center justify-center">
      
      {/* Título Compacto para móvil */}
      <div className="absolute top-6 md:top-16 left-1/2 -translate-x-1/2 text-center z-20 w-full px-4">
        <h2 className="text-3xl md:text-8xl font-display font-black text-amber-950 uppercase tracking-tighter drop-shadow-xl">MAPA</h2>
        <p className="text-amber-900 font-display font-bold text-[8px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] italic mt-1">LOS DOMINIOS DEL REINO</p>
      </div>

      {/* Ubicaciones Escaladas */}
      {buildings.map((b) => (
        <button
          key={b.id}
          onClick={() => onNavigate(b.id)}
          className="absolute group -translate-x-1/2 -translate-y-1/2 transition-all active:scale-95"
          style={{ left: b.x, top: b.y }}
        >
          <div className="flex flex-col items-center">
            <div className="relative size-20 sm:size-32 md:size-56 flex items-center justify-center elevated-3d rounded-xl md:rounded-2xl border-2 md:border-4 border-amber-900/20 bg-white/10 shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl sm:text-6xl md:text-[120px] text-white/60 group-hover:text-white transition-colors">
                {b.icon}
              </span>
            </div>
            
            <div className="mt-2 md:mt-8 text-center">
              <p className="text-amber-950 font-display font-black text-xs md:text-4xl uppercase tracking-tighter whitespace-nowrap">
                {b.label}
              </p>
            </div>
          </div>
        </button>
      ))}

      {/* Rosa de los vientos simplificada */}
      <div className="absolute bottom-4 right-4 md:bottom-16 md:right-16 opacity-30 pointer-events-none">
        <span className="material-symbols-outlined text-4xl md:text-[100px] text-amber-950 animate-[spin_60s_linear_infinite]">explore</span>
      </div>
    </div>
  );
};

export default WorldMap;
