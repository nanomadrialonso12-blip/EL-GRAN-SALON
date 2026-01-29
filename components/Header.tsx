
import React from 'react';
import { UserStats } from '../types';
import KnightAvatar from './KnightAvatar';

interface HeaderProps {
  stats: UserStats;
  onOpenSettings: () => void;
  onBackToMap: () => void;
  isMapVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ stats, onOpenSettings, onBackToMap, isMapVisible }) => {
  return (
    <header className="relative z-50 h-20 md:h-24 flex items-center justify-between px-4 md:px-10 bg-[#151617] elevated-3d border-b border-white/5">
      <div className="flex items-center gap-2 md:gap-10">
        <button 
          onClick={onBackToMap}
          className={`group flex items-center gap-2 md:gap-4 px-3 md:px-6 py-2 rounded-lg transition-all ${
            isMapVisible ? 'bg-white/5 text-white shadow-inner' : 'text-white/40 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl md:text-3xl">explore</span>
          <span className="font-display text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] hidden sm:inline">Mapa</span>
        </button>
        
        <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
        
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white/20 hidden xs:block">fort</span>
          <h1 className="font-display text-xs md:text-xl font-black text-white uppercase tracking-tighter italic whitespace-nowrap">EL GRAN SALÓN</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-10">
        <div className="flex items-center gap-4 md:gap-8 border-r border-white/10 pr-3 md:pr-10">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 md:gap-2">
              <span className="text-sm md:text-2xl font-display font-bold text-white leading-none">{stats.gold.toLocaleString()}</span>
              <span className="material-symbols-outlined text-gold text-sm md:text-lg">monetization_on</span>
            </div>
          </div>
          
          <div className="text-right hidden xs:block">
            <div className="flex items-center justify-end gap-1 md:gap-2">
              <span className="text-sm md:text-2xl font-display font-bold text-white leading-none">{stats.honors}</span>
              <span className="material-symbols-outlined text-white text-sm md:text-lg white-glow">military_tech</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <div className="text-right hidden md:block">
            <p className="text-white font-display font-bold text-sm tracking-wide leading-none">Gran Caballero</p>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1.5">{stats.currentTitle}</p>
          </div>
          <div className="relative cursor-pointer group" onClick={onOpenSettings}>
             <div className="size-10 md:size-16 rounded-full border-2 border-white/10 p-0.5 md:p-1 bg-black shadow-2xl overflow-hidden">
                <KnightAvatar config={stats.avatar} size={48} />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
