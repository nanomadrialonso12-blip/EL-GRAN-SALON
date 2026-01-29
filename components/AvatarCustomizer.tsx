
import React, { useState } from 'react';
import { AvatarConfig, ArmorType, HelmetType, CapeColor, HairStyle, HairColor, BeardStyle, Expression } from '../types';
import KnightAvatar from './KnightAvatar';

interface AvatarCustomizerProps {
  config: AvatarConfig;
  userLevel: number;
  unlockedItems: string[];
  t: any;
  onChange: (newConfig: AvatarConfig) => void;
  onClose: () => void;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ config, userLevel, unlockedItems, t, onChange, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'armor' | 'helmet' | 'hair' | 'beard' | 'expression' | 'cape'>('armor');

  const armors: { value: ArmorType; minLvl: number; shopItem?: string }[] = [
    { value: 'Leather', minLvl: 1 },
    { value: 'Iron', minLvl: 5 },
    { value: 'Steel', minLvl: 10 },
    { value: 'Royal', minLvl: 15 },
    { value: 'Silver', minLvl: 99, shopItem: 'Armadura de Plata' },
  ];

  const helmets: { value: HelmetType; minLvl: number; shopItem?: string }[] = [
    { value: 'None', minLvl: 1 },
    { value: 'Basic', minLvl: 5 },
    { value: 'Visor', minLvl: 10 },
    { value: 'Plumed', minLvl: 15 },
    { value: 'Gold', minLvl: 99, shopItem: 'Yelmo de Oro de 24k' },
  ];

  const hairStyles: HairStyle[] = ['Spiky', 'Flowing', 'Short', 'Bald'];
  const hairColors: { value: HairColor; name: string }[] = [
    { value: '#fbbf24', name: 'Golden' },
    { value: '#451a03', name: 'Brown' },
    { value: '#1e293b', name: 'Black' },
    { value: '#ef4444', name: 'Red' },
    { value: '#3b82f6', name: 'Blue' },
  ];

  const beardStyles: BeardStyle[] = ['None', 'Stubble', 'Goatee', 'Full', 'Van Dyke'];
  const expressions: Expression[] = ['Neutral', 'Fierce', 'Peaceful', 'Exhausted', 'Victorious'];

  const categories = [
    { id: 'armor', icon: 'shield', label: 'Armadura' },
    { id: 'helmet', icon: 'helmet', label: 'Yelmo' },
    { id: 'hair', icon: 'face', label: 'Pelo' },
    { id: 'beard', icon: 'face_retouching_natural', label: 'Barba' },
    { id: 'expression', icon: 'face_6', label: 'Gesto' },
    { id: 'cape', icon: 'apparel', label: 'Capa' },
  ];

  const isUnlocked = (item: { minLvl: number; shopItem?: string }) => {
    if (item.shopItem && unlockedItems.includes(item.shopItem)) return true;
    return userLevel >= item.minLvl;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
      <div className="parchment-texture w-full h-full md:max-w-6xl md:h-[90vh] md:rounded-[40px] shadow-2xl border-mahogany flex flex-col md:flex-row overflow-hidden border-t-[8px] md:border-x-[16px]">
        
        {/* Previsualización del Avatar (FIJA EN MÓVIL) */}
        <div className="w-full md:w-2/5 p-4 md:p-12 flex flex-col items-center justify-center bg-black/30 border-b md:border-b-0 md:border-r border-amber-900/10 shrink-0 relative z-20">
          <div className="absolute top-4 right-4 md:hidden">
             <button onClick={onClose} className="size-10 flex items-center justify-center bg-amber-950 text-gold rounded-full shadow-xl">
                <span className="material-symbols-outlined">close</span>
             </button>
          </div>
          
          <div className="relative p-2 md:p-8 bg-black/40 rounded-full elevated-3d shadow-inner mb-2 md:mb-8">
            <KnightAvatar config={config} size={window.innerWidth < 768 ? 140 : 320} className="relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent rounded-full pointer-events-none"></div>
          </div>
          
          <div className="bg-amber-900/20 px-6 py-1 md:py-3 rounded-full border border-gold/30 shadow-lg">
             <p className="text-gold font-display font-black text-xs md:text-2xl uppercase tracking-widest">NIVEL {userLevel}</p>
          </div>
        </div>

        {/* Panel de Selección (DESLIZABLE) */}
        <div className="flex-1 flex flex-col bg-white/5 overflow-hidden">
          {/* Selector de Categorías Horizontal */}
          <div className="flex overflow-x-auto gap-3 p-4 md:p-8 no-scrollbar border-b border-black/10 shrink-0 bg-black/10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex-none px-4 py-2 md:size-16 rounded-xl flex items-center justify-center transition-all border ${
                  activeCategory === cat.id 
                  ? 'bg-amber-950 text-gold border-gold/50 scale-105 shadow-xl' 
                  : 'bg-black/20 text-amber-900/40 border-transparent'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                  <span className="text-[7px] font-black uppercase tracking-widest hidden md:block">{cat.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Rejilla de Opciones */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar pb-32">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeCategory === 'armor' && (
                <div className="grid grid-cols-2 gap-4">
                  {armors.map((a) => {
                    const unlocked = isUnlocked(a);
                    const isSelected = config.armor === a.value;
                    return (
                      <button
                        key={a.value}
                        disabled={!unlocked}
                        onClick={() => onChange({ ...config, armor: a.value })}
                        className={`relative p-5 md:p-8 rounded-2xl border-2 text-left transition-all ${
                          isSelected 
                          ? 'bg-amber-950 border-gold text-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                          : 'bg-white/40 border-amber-900/5 text-amber-900 hover:bg-white/60'
                        } ${!unlocked ? 'opacity-20 grayscale cursor-not-allowed' : 'active:scale-95'}`}
                      >
                        <p className="font-display font-black text-xs md:text-xl uppercase">{a.value}</p>
                        {!unlocked && <p className="text-[7px] md:text-[10px] font-bold mt-1 uppercase text-red-900">Requiere Nv. {a.minLvl}</p>}
                        {isSelected && <span className="absolute top-2 right-2 material-symbols-outlined text-xs">verified</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {activeCategory === 'helmet' && (
                <div className="grid grid-cols-2 gap-4">
                  {helmets.map((h) => {
                    const unlocked = isUnlocked(h);
                    const isSelected = config.helmet === h.value;
                    return (
                      <button
                        key={h.value}
                        disabled={!unlocked}
                        onClick={() => onChange({ ...config, helmet: h.value })}
                        className={`relative p-5 md:p-8 rounded-2xl border-2 text-left transition-all ${
                          isSelected 
                          ? 'bg-amber-950 border-gold text-gold shadow-xl' 
                          : 'bg-white/40 border-amber-900/5 text-amber-900'
                        } ${!unlocked ? 'opacity-20 grayscale' : 'active:scale-95'}`}
                      >
                        <p className="font-display font-black text-xs md:text-xl uppercase">{h.value}</p>
                        {isSelected && <span className="absolute top-2 right-2 material-symbols-outlined text-xs">verified</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {activeCategory === 'hair' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    {hairStyles.map((h) => (
                      <button
                        key={h}
                        onClick={() => onChange({ ...config, hair: h })}
                        className={`p-4 md:p-6 rounded-2xl border-2 font-display font-black uppercase text-[9px] md:text-sm tracking-widest transition-all ${
                          config.hair === h ? 'bg-amber-950 border-gold text-gold' : 'bg-white/40 border-transparent text-amber-900'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                  <div className="bg-black/5 p-6 rounded-2xl border border-black/5">
                    <p className="text-[9px] font-black uppercase text-amber-950/40 mb-6 tracking-widest text-center">Color del Vello</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {hairColors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => onChange({ ...config, hairColor: c.value })}
                          style={{ backgroundColor: c.value }}
                          className={`size-12 md:size-14 rounded-full border-4 shadow-lg transition-transform ${config.hairColor === c.value ? 'border-amber-950 scale-110 rotate-12' : 'border-white'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'beard' && (
                <div className="grid grid-cols-2 gap-4">
                  {beardStyles.map((b) => (
                    <button
                      key={b}
                      onClick={() => onChange({ ...config, beard: b })}
                      className={`p-5 md:p-8 rounded-2xl border-2 text-left transition-all ${
                        config.beard === b ? 'bg-amber-950 border-gold text-gold shadow-xl' : 'bg-white/40 border-transparent text-amber-900'
                      }`}
                    >
                      <p className="font-display font-black text-xs md:text-xl uppercase">{b}</p>
                    </button>
                  ))}
                </div>
              )}

              {activeCategory === 'expression' && (
                <div className="grid grid-cols-2 gap-4">
                  {expressions.map((e) => (
                    <button
                      key={e}
                      onClick={() => onChange({ ...config, expression: e })}
                      className={`p-5 md:p-8 rounded-2xl border-2 text-left transition-all ${
                        config.expression === e ? 'bg-amber-950 border-gold text-gold shadow-xl' : 'bg-white/40 border-transparent text-amber-900'
                      }`}
                    >
                      <p className="font-display font-black text-xs md:text-xl uppercase">{e}</p>
                    </button>
                  ))}
                </div>
              )}

              {activeCategory === 'cape' && (
                <div className="grid grid-cols-5 gap-3">
                  {['#4a0404', '#0f172a', '#1e293b', '#581c87', '#b45309'].map((color) => (
                    <button
                      key={color}
                      onClick={() => onChange({ ...config, capeColor: color as CapeColor })}
                      style={{ backgroundColor: color }}
                      className={`aspect-square rounded-xl border-4 transition-all ${config.capeColor === color ? 'border-amber-950 scale-110 shadow-xl' : 'border-white/20'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón de Confirmar (FIJO ABAJO) */}
          <div className="p-4 md:p-10 shrink-0 bg-white/5 border-t border-black/10 backdrop-blur-md">
            <button 
              onClick={onClose}
              className="w-full py-5 md:py-8 bg-amber-950 text-gold font-display font-black rounded-xl uppercase tracking-[0.3em] text-[10px] md:text-sm shadow-2xl active:scale-95 transition-all border border-gold/20"
            >
              FORJAR DESTINO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
