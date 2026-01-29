
import React from 'react';
import { UserStats, Quest, Title } from '../types';
import KnightAvatar from './KnightAvatar';

interface DashboardProps {
  stats: UserStats;
  quests: Quest[];
  titles: Title[];
  t: any;
  isGenerating: boolean;
  onComplete: (id: string) => void;
  onOpenArmory: () => void;
  onFetchNewQuests: () => void;
  onUnlockTitle: (id: string) => void;
  onSetTitle: (name: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, quests, titles, t, isGenerating, 
  onComplete, onOpenArmory, onFetchNewQuests, 
  onUnlockTitle, onSetTitle 
}) => {
  const progressPercent = Math.round((stats.xp / stats.maxXp) * 100);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12 py-4 md:py-12">
      {/* Sección del Avatar: El Centro del Poder */}
      <div className="col-span-12 lg:col-span-7 flex flex-col items-center">
        <div className="w-full text-center mb-8 md:mb-16">
          <p className="text-gold font-display text-[10px] md:text-sm uppercase tracking-[0.4em] md:tracking-[0.6em] mb-2">{stats.currentTitle}</p>
          <h1 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
            EL REINO
          </h1>
          <div className="h-0.5 w-20 md:w-40 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mt-4"></div>
        </div>

        <div className="relative w-full flex justify-center">
          {/* Orbe de Experiencia Adaptativo */}
          <div className="relative size-[85vw] max-size-[500px] md:size-[600px] rounded-full elevated-3d p-4 md:p-16 flex items-center justify-center border-4 md:border-8 border-stone-panel overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            
            <svg className="absolute inset-0 size-full -rotate-90">
              <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#000" strokeWidth="10" opacity="0.4" />
              <circle 
                cx="50%" cy="50%" r="46%" fill="none" stroke="#ffffff" strokeWidth="6" 
                strokeDasharray="100 100" strokeDashoffset={100 - progressPercent}
                className="transition-all duration-1000 ease-out"
                style={{ 
                  strokeDasharray: 'calc(2 * 3.14159 * 46%)', 
                  strokeDashoffset: `calc(2 * 3.14159 * 46% * (1 - ${progressPercent / 100}))`,
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))'
                }}
              />
            </svg>
            
            <div className="z-10 flex flex-col items-center scale-75 md:scale-100">
              <div className="relative cursor-pointer" onClick={onOpenArmory}>
                <KnightAvatar config={stats.avatar} size={300} className="relative z-10" />
              </div>
              
              <div className="mt-4 md:mt-10 flex flex-col items-center gap-2">
                 <div className="px-4 py-1.5 bg-black/60 border border-white/10 rounded-full backdrop-blur-md shadow-2xl">
                    <span className="text-white font-display font-black text-[9px] md:text-xs tracking-widest whitespace-nowrap">NIVEL {stats.level} • {stats.xp}/{stats.maxXp} EXP</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onOpenArmory}
          className="mt-8 md:mt-16 group flex items-center gap-4 md:gap-6 px-8 md:px-16 py-4 md:py-6 bg-stone-panel border border-white/10 text-white font-display font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)] elevated-3d"
        >
          <span className="material-symbols-outlined text-sm md:text-2xl">construction</span>
          Armería
        </button>
      </div>

      {/* Misiones: Pergamino Adaptado */}
      <div className="col-span-12 lg:col-span-5 flex flex-col mt-8 lg:mt-0">
        <div className="parchment-texture p-6 md:p-14 rounded-lg shadow-2xl min-h-[500px] flex flex-col border-y-[10px] md:border-y-[20px] border-mahogany">
          <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-mahogany/10 pb-4 md:pb-8">
            <span className="material-symbols-outlined text-mahogany/60 text-xl">bookmark</span>
            <h3 className="text-mahogany font-display text-2xl md:text-4xl font-black uppercase tracking-tighter">MISIONES</h3>
            <span className="material-symbols-outlined text-mahogany/60 text-xl">bookmark</span>
          </div>

          <div className="space-y-4 md:space-y-8 flex-1 overflow-y-auto pr-2 md:pr-6 custom-scrollbar max-h-[400px] lg:max-h-none">
            {quests.length > 0 ? quests.map((quest) => (
              <div key={quest.id} className={`group p-4 md:p-8 bg-mahogany/5 rounded border border-mahogany/10 ${quest.completed ? 'opacity-40' : ''}`}>
                <div className="flex items-start gap-4 md:gap-8">
                  <button 
                    onClick={() => onComplete(quest.id)}
                    disabled={quest.completed}
                    className={`size-10 md:size-14 border flex items-center justify-center transition-all shrink-0 ${
                      quest.completed 
                      ? 'bg-black text-white' 
                      : 'border-mahogany/40 bg-white/10 text-mahogany'
                    }`}
                  >
                    <span className="material-symbols-outlined font-black text-sm md:text-xl">
                      {quest.completed ? 'task_alt' : 'circle'}
                    </span>
                  </button>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-mahogany font-display font-bold text-sm md:text-xl uppercase leading-tight">
                        {quest.title}
                      </h4>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[9px] md:text-xs font-black text-amber-900">{quest.rewardGold}G</span>
                      </div>
                    </div>
                    <p className="text-mahogany/70 text-[11px] md:text-sm mt-2 italic font-medieval leading-relaxed">
                      {quest.description}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-mahogany/20 italic font-medieval py-10">
                 <span className="material-symbols-outlined text-6xl mb-4">drafts</span>
                 <p className="text-xl">Sin órdenes...</p>
              </div>
            )}
          </div>

          <button 
            onClick={onFetchNewQuests}
            disabled={isGenerating}
            className="mt-6 md:mt-12 w-full py-5 md:py-8 bg-mahogany text-gold font-display font-black rounded border border-gold/20 text-[10px] md:text-xs tracking-[0.3em] flex items-center justify-center gap-4"
          >
            <span className={`material-symbols-outlined ${isGenerating ? 'animate-spin' : ''}`}>history_edu</span>
            {isGenerating ? 'Consultando...' : 'Solicitar Misiones'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
