
import React from 'react';
import { Deed, ActiveDuels } from '../types';

interface SocialProps {
  deeds: Deed[];
  t: any;
  activeDuels: ActiveDuels;
  isGeneratingDeeds: boolean;
  onToggleDeed: (id: string) => void;
  onClaimRewards: () => void;
  onStartDuel: (id: string) => void;
  onCancelDuel: (id: string) => void;
  onWinDuel: (id: string) => void;
}

const Social: React.FC<SocialProps> = ({ 
  deeds, t, activeDuels, isGeneratingDeeds, 
  onToggleDeed, onClaimRewards, onStartDuel, onCancelDuel, onWinDuel 
}) => {
  // Lista extendida de amigos para permitir múltiples retos
  const friends = [
    { id: 'f1', name: 'Sir Cedric de Código', streak: 24, level: 18, online: true, rank: 1, challengeScore: 4.5 },
    { id: 'f2', name: `Tú (Alto Paladín)`, streak: 12, level: 14, online: true, rank: 2, challengeScore: 2.0 },
    { id: 'f3', name: 'Lady Elara de Lógica', streak: 9, level: 15, online: false, rank: 3, challengeScore: 3.2 },
    { id: 'f4', name: 'Barón Bash Shell', streak: 1, level: 12, online: false, rank: 4, challengeScore: 0.5 },
    { id: 'f5', name: 'Lady Beatriz de Backend', streak: 15, level: 16, online: true, rank: 5, challengeScore: 5.0 },
    { id: 'f6', name: 'Duque Dom de Frontend', streak: 5, level: 13, online: true, rank: 6, challengeScore: 2.5 },
    { id: 'f7', name: 'Sir Galahad de Git', streak: 30, level: 20, online: false, rank: 7, challengeScore: 6.0 },
    { id: 'f8', name: 'Lady Isolda de IA', streak: 3, level: 11, online: true, rank: 8, challengeScore: 1.5 },
  ];

  const allCompleted = deeds.length > 0 && deeds.every(d => d.completed);

  const formatExactTime = (hours: number) => {
    const totalSeconds = Math.floor(hours * 3600);
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  };

  const duelList = (Object.entries(activeDuels) as [string, number][]).map(([id, progress]) => {
    const friend = friends.find(f => f.id === id);
    return { id, progress, friend };
  }).filter((d): d is { id: string; progress: number; friend: typeof friends[0] } => d.friend !== undefined);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 md:space-y-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div className="w-full text-center md:text-left">
          <h2 className="text-3xl md:text-6xl font-black text-white tracking-widest uppercase font-medieval drop-shadow-2xl">La Taberna</h2>
          <p className="text-gold italic text-[10px] md:text-xl font-medieval mt-2 opacity-60">"Cada brindis es una promesa, cada justa un honor."</p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12">
        {/* Pergamino de Hazañas */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8 px-2">
          <div className="parchment-texture p-6 md:p-10 rounded-sm shadow-2xl border-[8px] md:border-[12px] border-mahogany flex flex-col min-h-[400px]">
            <div className="text-center mb-6 border-b border-mahogany/20 pb-4">
              <h3 className="text-lg md:text-2xl font-bold flex items-center justify-center gap-3 text-amber-950 uppercase font-medieval tracking-widest">
                <span className="material-symbols-outlined text-xl">history_edu</span> Hazañas del Día
              </h3>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
              {deeds.length > 0 ? deeds.map((deed) => (
                <div 
                  key={deed.id}
                  onClick={() => onToggleDeed(deed.id)}
                  className={`flex items-center gap-4 p-4 transition-all cursor-pointer border-b border-mahogany/10 group rounded-md ${
                    deed.completed ? 'opacity-40 bg-black/5' : 'hover:bg-mahogany/5'
                  }`}
                >
                  <div className={`size-8 md:size-10 rounded-sm flex items-center justify-center border-2 md:border-4 transition-all shrink-0 ${deed.completed ? 'bg-amber-950 border-amber-950 text-gold' : 'border-mahogany/40 bg-transparent'}`}>
                    {deed.completed && <span className="material-symbols-outlined text-sm font-black">check</span>}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-sm md:text-lg font-black font-medieval text-amber-950 uppercase leading-tight truncate ${deed.completed ? 'line-through' : ''}`}>{deed.task}</p>
                    <p className="text-[8px] font-black uppercase text-amber-900/60 tracking-[0.2em] mt-1">{deed.category}</p>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center text-amber-950/30 italic font-medieval">
                   <p>No hay decretos reales pendientes.</p>
                </div>
              )}
            </div>

            <div className="mt-6">
               <button 
                  onClick={onClaimRewards}
                  disabled={!allCompleted || isGeneratingDeeds}
                  className={`w-full py-4 rounded-sm font-black uppercase text-[10px] tracking-widest transition-all flex flex-col items-center gap-1 shadow-2xl border-2 ${
                    allCompleted ? 'bg-amber-950 text-gold border-gold/40 active:scale-95' : 'bg-transparent text-amber-950/40 border-mahogany/20'
                  }`}
               >
                  <span className="font-medieval text-xs">{isGeneratingDeeds ? 'Consultando Escribas...' : allCompleted ? 'Reclamar Gloria Real' : 'Cumple tus Deberes'}</span>
                  {allCompleted && <span className="text-[7px] opacity-70 font-display tracking-[0.3em]">+200 Oro / +400 XP</span>}
               </button>
            </div>
          </div>
        </div>

        {/* Duelos y Clasificación */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-8 md:gap-10 px-2">
          {/* Listado de Duelos Activos - Con scroll si hay muchos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <p className="text-gold font-medieval font-black text-xs uppercase tracking-[0.3em]">Justas en Curso ({duelList.length})</p>
               {duelList.length > 0 && <span className="text-[8px] text-white/20 font-black uppercase">¡Estudia para progresar en todas!</span>}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {duelList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {duelList.map(({ id, progress, friend }) => {
                    const isWinner = progress >= (friend?.challengeScore || 0);
                    return (
                      <div key={id} className={`elevated-3d rounded-xl p-5 transition-all shadow-xl border-2 ${isWinner ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/5'}`}>
                        <div className="flex justify-between items-center mb-4">
                           <div className="overflow-hidden">
                              <p className="text-white/60 font-medieval font-bold text-[10px] uppercase truncate">Rival: {friend?.name}</p>
                           </div>
                           <div className="flex items-center gap-1 shrink-0">
                              <span className="size-1.5 bg-red-500 rounded-full animate-pulse"></span>
                              <p className="text-[7px] text-white font-black uppercase tracking-widest">En Combate</p>
                           </div>
                        </div>
                        <div className="flex items-center justify-between border-y border-white/5 py-4 mb-4">
                          <div className="text-center">
                            <p className="text-xl md:text-2xl font-black text-white tabular-nums font-medieval">{formatExactTime(progress)}</p>
                            <p className="text-[7px] text-white/40 font-black uppercase">Tu Tiempo</p>
                          </div>
                          <div className="text-center">
                             <span className="material-symbols-outlined text-white/10">swords</span>
                          </div>
                          <div className="text-center opacity-40">
                            <p className="text-xl md:text-2xl font-black text-white tabular-nums font-medieval">{formatExactTime(friend?.challengeScore || 0)}</p>
                            <p className="text-[7px] text-white/40 font-black uppercase">Meta</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => isWinner ? onWinDuel(id) : onCancelDuel(id)} 
                          className={`w-full py-2.5 rounded-sm font-black uppercase text-[8px] tracking-widest transition-all ${
                            isWinner ? 'bg-gold text-black shadow-lg animate-bounce' : 'bg-white/5 text-white/30 hover:text-red-500 hover:bg-red-500/10'
                          }`}
                        >
                          {isWinner ? '¡DECLARAR VICTORIA!' : 'ABANDONAR JUSTA'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center rounded-xl border-2 border-dashed border-white/5 opacity-20">
                   <p className="font-medieval text-sm uppercase tracking-widest">Ninguna justa activa. ¡Retad a alguien!</p>
                </div>
              )}
            </div>
          </div>

          {/* Clasificación de la Taberna */}
          <div className="elevated-3d rounded-2xl shadow-2xl overflow-hidden border-2 border-white/5">
            <div className="p-5 md:p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h3 className="text-lg md:text-2xl font-bold flex items-center gap-3 text-white uppercase font-medieval tracking-widest">
                 Clasificación Real
              </h3>
              <div className="flex items-center gap-2">
                 <span className="text-[8px] text-white/40 font-black uppercase hidden sm:block">Duelo: 100G</span>
                 <span className="material-symbols-outlined text-gold">military_tech</span>
              </div>
            </div>
            <div className="p-2 md:p-6 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {friends.map((friend) => {
                const isChallenged = activeDuels[friend.id] !== undefined;
                const isMe = friend.id === 'f2';
                return (
                  <div key={friend.id} className={`flex items-center justify-between p-4 rounded-xl transition-all border ${isMe ? 'bg-gold/5 border-gold/20' : 'bg-white/5 border-transparent'}`}>
                    <div className="flex items-center gap-4">
                      <span className={`text-lg md:text-2xl font-medieval font-black w-6 text-center ${friend.rank <= 3 ? 'text-gold' : 'text-white/20'}`}>{friend.rank}</span>
                      <div className="overflow-hidden">
                        <p className="font-medieval font-black text-[11px] md:text-lg text-white tracking-widest uppercase truncate max-w-[150px] md:max-w-none">{friend.name}</p>
                        <div className="flex items-center gap-2">
                           <p className="text-[7px] text-white/40 font-black uppercase tracking-widest">NIVEL {friend.level}</p>
                           <span className="size-1 rounded-full bg-white/20"></span>
                           <p className="text-[7px] text-gold/60 font-black uppercase tracking-widest">{friend.streak} RACHA</p>
                        </div>
                      </div>
                    </div>
                    {!isMe && (
                      <button 
                        disabled={isChallenged}
                        onClick={() => onStartDuel(friend.id)}
                        className={`px-4 py-2 rounded-sm font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] transition-all border ${
                          isChallenged 
                          ? 'bg-red-500/10 border-red-500/30 text-red-500/60 cursor-not-allowed' 
                          : 'bg-white/10 text-gold border-gold/20 hover:bg-gold hover:text-black shadow-lg active:scale-95'
                        }`}
                      >
                        {isChallenged ? 'EN COMBATE' : 'RETAR'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
