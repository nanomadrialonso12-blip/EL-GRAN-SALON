
import React, { useState, useEffect } from 'react';
import { Tab, UserStats, Quest, Title, AvatarConfig, ActiveDuels, Deed, ArmorType, HelmetType, ShopItem } from './types';
import { translations as t } from './translations';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Study from './components/Study';
import Fitness from './components/Fitness';
import Social from './components/Social';
import Shop from './components/Shop';
import WorldMap from './components/WorldMap';
import AvatarCustomizer from './components/AvatarCustomizer';
import { generateNewQuests, generateNewDeeds, generateShopItems } from './services/geminiService';

const INITIAL_STATS: UserStats = {
  level: 1,
  xp: 0,
  maxXp: 1000,
  energy: 100,
  gold: 500, // Iniciamos con algo más de oro para probar duelos
  honors: 0,
  streak: 1,
  currentTitle: 'Escudero Novato',
  totalStudyHours: 0,
  unlockedItems: [],
  avatar: {
    armor: 'Leather',
    helmet: 'None',
    capeColor: '#4a0404',
    shield: 'Wood',
    emblem: 'None',
    finish: 'Standard',
    hair: 'Short',
    hairColor: '#451a03',
    beard: 'None',
    expression: 'Neutral'
  }
};

const INITIAL_DEEDS: Deed[] = [
  { id: 'd1', task: 'Saneamiento de los Calderos (Lavar platos)', category: 'Hogar', completed: false },
  { id: 'd2', task: 'Organización de la Armería (Ordenar cuarto)', category: 'Orden', completed: false },
  { id: 'd3', task: 'Abastecimiento del Granero (Hacer compra)', category: 'Logística', completed: false },
  { id: 'd4', task: 'Misiva a los Aliados (Llamar a un familiar)', category: 'Social', completed: false },
];

const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Ruta de los 5KM', description: 'Corre o camina 5km para mejorar tu resistencia.', progress: 0, target: 1, completed: false, rewardGold: 200, rewardXp: 400, type: 'fitness' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [showMap, setShowMap] = useState(true);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [deeds, setDeeds] = useState<Deed[]>(INITIAL_DEEDS);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [claimedRealLifeIds, setClaimedRealLifeIds] = useState<string[]>([]);
  const [showArmory, setShowArmory] = useState(false);
  const [isGeneratingQuests, setIsGeneratingQuests] = useState(false);
  const [isGeneratingDeeds, setIsGeneratingDeeds] = useState(false);
  const [isRefreshingShop, setIsRefreshingShop] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [studyMode, setStudyMode] = useState<'pomodoro' | 'study'>('pomodoro');
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [activeDuels, setActiveDuels] = useState<ActiveDuels>({});

  useEffect(() => {
    if (shopItems.length === 0) {
      handleRefreshShop();
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        const hourFraction = 1 / 3600;
        setTimeLeft(prev => prev - 1);
        setSessionSeconds(prev => {
          const next = prev + 1;
          if (next % 60 === 0) {
            setStats(s => ({ ...s, gold: s.gold + 1 }));
            addXp(10);
          }
          return next;
        });
        setStats(s => ({ ...s, totalStudyHours: s.totalStudyHours + hourFraction }));
        setActiveDuels(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(id => {
            updated[id] = updated[id] + hourFraction;
          });
          return updated;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      const gold = studyMode === 'pomodoro' ? 60 : 150;
      const xp = studyMode === 'pomodoro' ? 200 : 500;
      setStats(s => ({ ...s, gold: s.gold + gold }));
      addXp(xp);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, studyMode]);

  const addXp = (amount: number) => {
    setStats(s => {
      let newXp = s.xp + amount;
      let newLvl = s.level;
      let newMax = s.maxXp;
      while (newXp >= newMax) {
        newLvl++;
        newXp = newXp - newMax;
        newMax = Math.round(newMax * 1.3);
      }
      return { ...s, level: newLvl, xp: newXp, maxXp: newMax };
    });
  };

  const handleQuestComplete = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        addXp(q.rewardXp);
        setStats(s => ({ ...s, gold: s.gold + q.rewardGold, honors: s.honors + 1 }));
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const handleRefreshShop = async () => {
    setIsRefreshingShop(true);
    try {
      const newItems = await generateShopItems(stats.level);
      setShopItems(newItems);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshingShop(false);
    }
  };

  const handleBuyItem = (item: ShopItem) => {
    if (stats.gold >= item.price) {
      setStats(s => {
        const newStats = { ...s, gold: s.gold - item.price };
        if (item.category === 'avatar') {
          newStats.unlockedItems = [...s.unlockedItems, item.name];
        } else {
          setClaimedRealLifeIds(prev => [...prev, item.id]);
        }
        return newStats;
      });
    }
  };

  const navigateTo = (tab: Tab) => {
    setActiveTab(tab);
    setShowMap(false);
  };

  const startDuel = (friendId: string) => {
    // Usamos actualizaciones de estado funcionales para asegurar consistencia
    setStats(prevStats => {
      if (prevStats.gold < 100) {
        alert("¡Necesitas al menos 100 monedas de oro para iniciar una justa!");
        return prevStats;
      }

      // Verificamos si ya hay un duelo activo con este amigo
      // Aunque el botón se desactive, esto protege la lógica
      setActiveDuels(prevDuels => {
        if (prevDuels[friendId] !== undefined) return prevDuels;
        return { ...prevDuels, [friendId]: 0 };
      });

      return { ...prevStats, gold: prevStats.gold - 100 };
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark">
      <Header 
        stats={stats} 
        onOpenSettings={() => setShowArmory(true)} 
        onBackToMap={() => setShowMap(true)} 
        isMapVisible={showMap} 
      />
      
      <div className="flex-1 overflow-y-auto pb-24 md:pb-0 stone-texture">
        <main className="min-h-full px-4 py-6 md:p-8">
          {showMap ? (
            <WorldMap onNavigate={navigateTo} t={t} />
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === Tab.DASHBOARD && (
                <Dashboard 
                  stats={stats} quests={quests} titles={[]} t={t} isGenerating={isGeneratingQuests}
                  onComplete={handleQuestComplete} onOpenArmory={() => setShowArmory(true)} 
                  onFetchNewQuests={async () => {
                    setIsGeneratingQuests(true);
                    const q = await generateNewQuests(stats.level);
                    setQuests(q);
                    setIsGeneratingQuests(false);
                  }}
                  onUnlockTitle={() => {}} onSetTitle={() => {}}
                />
              )}
              {activeTab === Tab.STUDY && (
                <Study 
                  timeLeft={timeLeft} isRunning={isRunning} mode={studyMode}
                  totalStudyHours={stats.totalStudyHours} sessionSeconds={sessionSeconds}
                  activeDuelsCount={Object.keys(activeDuels).length} onToggle={() => setIsRunning(!isRunning)}
                  onReset={() => { setIsRunning(false); setTimeLeft(studyMode === 'pomodoro' ? 25 * 60 : 50 * 60); setSessionSeconds(0); }}
                  onSetMode={(m) => { setStudyMode(m); setTimeLeft(m === 'pomodoro' ? 25 * 60 : 50 * 60); }} t={t}
                />
              )}
              {activeTab === Tab.FITNESS && <Fitness onComplete={() => { addXp(250); setStats(s => ({ ...s, gold: s.gold + 100 })); }} t={t} />}
              {activeTab === Tab.SOCIAL && (
                <Social 
                  deeds={deeds} t={t} activeDuels={activeDuels} isGeneratingDeeds={isGeneratingDeeds}
                  onToggleDeed={(id) => setDeeds(prev => prev.map(d => d.id === id ? { ...d, completed: !d.completed } : d))}
                  onClaimRewards={async () => {
                    setIsGeneratingDeeds(true);
                    addXp(400);
                    setStats(s => ({ ...s, gold: s.gold + 200 }));
                    const d = await generateNewDeeds();
                    setDeeds(d);
                    setIsGeneratingDeeds(false);
                  }} 
                  onStartDuel={startDuel} 
                  onCancelDuel={(id) => setActiveDuels(prev => { const { [id]: _, ...rest } = prev; return rest; })}
                  onWinDuel={(id) => {
                    setActiveDuels(prev => { const { [id]: _, ...rest } = prev; return rest; });
                    setStats(s => ({ ...s, gold: s.gold + 400 }));
                    addXp(600);
                  }}
                />
              )}
              {activeTab === Tab.SHOP && (
                <Shop 
                  gold={stats.gold} unlockedItems={stats.unlockedItems} claimedRealLifeIds={claimedRealLifeIds}
                  shopItems={shopItems} isRefreshing={isRefreshingShop} onBuy={handleBuyItem} onRefresh={handleRefreshShop} t={t} 
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Navegación Inferior para Móviles */}
      {!showMap && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#151617] border-t border-white/10 flex items-center justify-around px-4 z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <button onClick={() => navigateTo(Tab.DASHBOARD)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.DASHBOARD ? 'text-white' : 'text-white/30'}`}>
            <span className="material-symbols-outlined">fort</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Inicio</span>
          </button>
          <button onClick={() => navigateTo(Tab.STUDY)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.STUDY ? 'text-white' : 'text-white/30'}`}>
            <span className="material-symbols-outlined">auto_stories</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Estudio</span>
          </button>
          <button onClick={() => navigateTo(Tab.FITNESS)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.FITNESS ? 'text-white' : 'text-white/30'}`}>
            <span className="material-symbols-outlined">exercise</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Gimnasio</span>
          </button>
          <button onClick={() => navigateTo(Tab.SOCIAL)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.SOCIAL ? 'text-white' : 'text-white/30'}`}>
            <span className="material-symbols-outlined">sports_bar</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Social</span>
          </button>
          <button onClick={() => navigateTo(Tab.SHOP)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.SHOP ? 'text-white' : 'text-white/30'}`}>
            <span className="material-symbols-outlined">payments</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Tienda</span>
          </button>
        </nav>
      )}

      {showArmory && (
        <AvatarCustomizer 
          config={stats.avatar} userLevel={stats.level} unlockedItems={stats.unlockedItems}
          t={t} onChange={(cfg) => setStats(s => ({ ...s, avatar: cfg }))} onClose={() => setShowArmory(false)} 
        />
      )}
    </div>
  );
};

export default App;
