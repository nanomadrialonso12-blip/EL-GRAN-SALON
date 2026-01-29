
import React from 'react';
import { ShopItem } from '../types';

interface ShopProps {
  gold: number;
  unlockedItems: string[];
  claimedRealLifeIds: string[];
  shopItems: ShopItem[];
  isRefreshing: boolean;
  onBuy: (item: ShopItem) => void;
  onRefresh: () => void;
  t: any;
}

const Shop: React.FC<ShopProps> = ({ gold, unlockedItems, claimedRealLifeIds, shopItems, isRefreshing, onBuy, onRefresh, t }) => {
  const categories = [
    { id: 'real-life', label: 'Indulgencias Reales', icon: 'history_edu' },
    { id: 'avatar', label: 'Forja de Avatar', icon: 'shield' }
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-24 pb-32">
      {/* Cabecera de la Tienda */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-6">
        <div className="w-full text-center md:text-left">
          <h2 className="text-4xl md:text-8xl font-display font-black text-white tracking-tighter uppercase drop-shadow-2xl">TESORERÍA</h2>
          <p className="text-gold italic text-sm md:text-2xl font-medieval opacity-60">"Donde el oro se hace gloria."</p>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <button onClick={onRefresh} className="flex-1 sm:flex-none p-4 md:p-6 elevated-3d rounded-xl border border-white/10 active:scale-95 transition-transform">
            <span className={`material-symbols-outlined text-gold ${isRefreshing ? 'animate-spin' : ''}`}>cyclone</span>
          </button>
          <div className="flex-1 sm:min-w-48 p-4 md:p-8 bg-[#151617] border-b-4 border-gold/40 flex flex-col items-end shadow-2xl">
            <span className="text-[8px] font-black text-gold/40 uppercase tracking-widest mb-1">Fondos</span>
            <span className="font-display font-black text-2xl md:text-5xl text-white leading-none">{gold.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {isRefreshing && shopItems.length === 0 ? (
        <div className="py-40 text-center flex flex-col items-center gap-6">
           <div className="size-16 border-4 border-white/5 border-t-gold rounded-full animate-spin"></div>
           <p className="text-white/20 font-display text-sm uppercase tracking-widest animate-pulse">Consultando mercaderes...</p>
        </div>
      ) : (
        categories.map(cat => {
          const itemsInCategory = shopItems.filter(i => i.category === cat.id);
          if (itemsInCategory.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-8">
              {/* Separador de Categoría */}
              <div className="flex items-center gap-4">
                 <div className="size-10 rounded-full elevated-3d flex items-center justify-center border border-white/5">
                    <span className="material-symbols-outlined text-gold text-lg">{cat.icon}</span>
                 </div>
                 <h3 className="text-white font-display font-black uppercase tracking-[0.2em] text-sm md:text-2xl">{cat.label}</h3>
                 <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              {/* Rejilla de Objetos */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
                {itemsInCategory.map((item) => {
                  const isOwned = item.category === 'avatar' && unlockedItems.includes(item.name);
                  const isClaimed = item.category === 'real-life' && claimedRealLifeIds.includes(item.id);
                  const disabled = isOwned || isClaimed;

                  return (
                    <div key={item.id} className={`flex flex-col bg-stone-panel rounded-xl border border-white/5 overflow-hidden transition-all shadow-xl ${disabled ? 'opacity-30 grayscale pointer-events-none' : 'active:scale-95'}`}>
                      <div className="aspect-square flex items-center justify-center relative bg-black/40 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent opacity-50"></div>
                        <span className={`material-symbols-outlined text-5xl md:text-[80px] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] ${item.category === 'avatar' ? 'text-white/40' : 'text-gold/40'}`}>
                          {item.icon}
                        </span>
                        {isOwned && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-[10px] font-black text-white uppercase tracking-widest border border-white/20 px-2 py-1">Poseído</span></div>}
                      </div>
                      
                      <div className="p-4 md:p-8 flex flex-col gap-4 flex-1">
                        <div className="min-h-[60px] md:min-h-0">
                          <h3 className="font-display font-black text-[10px] md:text-xl text-white uppercase leading-tight">{item.name}</h3>
                          <p className="text-white/30 text-[9px] md:text-sm mt-2 italic font-medieval line-clamp-2 md:line-clamp-none">{item.desc}</p>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-white/20 uppercase">Tributo</span>
                            <span className="font-display font-black text-xs md:text-2xl text-gold">{item.price}G</span>
                          </div>
                          <button 
                            disabled={gold < item.price || disabled}
                            onClick={() => onBuy(item)}
                            className={`w-full py-2.5 md:py-4 font-display font-black text-[8px] md:text-[10px] uppercase rounded-sm transition-all shadow-lg ${
                              disabled 
                                ? 'bg-black/40 text-white/10' 
                                : gold >= item.price 
                                  ? 'bg-white text-black hover:bg-gold' 
                                  : 'bg-red-950/20 text-red-500 border border-red-500/10'
                            }`}
                          >
                            {isOwned ? 'POSEÍDO' : isClaimed ? 'USADO' : gold >= item.price ? 'ADQUIRIR' : 'FALTA ORO'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Shop;
