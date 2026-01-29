
import React, { useState } from 'react';
import { generateFitnessPlan } from '../services/geminiService';
import { TrainingPlan } from '../types';

interface FitnessProps {
  onComplete: () => void;
  t: any;
}

const Fitness: React.FC<FitnessProps> = ({ onComplete, t }) => {
  const [goals, setGoals] = useState('');
  const [weight, setWeight] = useState('');
  const [plan, setPlan] = useState<TrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goals || !weight) return;
    setIsLoading(true);
    try {
      const data = await generateFitnessPlan(goals, weight);
      setPlan(data);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-6xl font-display font-black text-white uppercase tracking-tighter drop-shadow-2xl">ARMAS</h2>
          <p className="text-white/40 italic text-xs md:text-xl font-medieval mt-1">"Forja tu cuerpo, Guerrero."</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:min-w-32 bg-stone-panel p-4 rounded-xl border border-white/5 text-center">
            <span className="text-[8px] font-black uppercase text-white/20 block mb-1">PODER</span>
            <span className="text-2xl font-display font-black text-white">85</span>
          </div>
          <div className="flex-1 sm:min-w-32 bg-stone-panel p-4 rounded-xl border border-white/5 text-center">
            <span className="text-[8px] font-black uppercase text-white/20 block mb-1">DEFENSA</span>
            <span className="text-2xl font-display font-black text-white">72</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12">
        <div className="col-span-12 lg:col-span-5">
          <div className="parchment-texture p-6 md:p-12 rounded-xl border-[10px] md:border-[16px] border-mahogany shadow-2xl">
            <h3 className="text-amber-950 font-display font-black text-xl uppercase mb-6 border-b border-mahogany/10 pb-4">PRONÓSTICO</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[8px] font-black uppercase text-amber-900/40 block mb-2 tracking-widest">Peso Actual</label>
                <input 
                  type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="ej. 80 kg"
                  className="w-full bg-transparent border-b-2 border-mahogany/20 p-2 text-xl font-display font-black text-amber-950 outline-none" 
                />
              </div>
              <div>
                <label className="text-[8px] font-black uppercase text-amber-900/40 block mb-2 tracking-widest">Meta de Campaña</label>
                <textarea 
                  value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="ej. Ser más ágil..."
                  className="w-full bg-transparent border-b-2 border-mahogany/20 p-2 text-sm font-bold text-amber-950 h-20 outline-none resize-none" 
                />
              </div>
              <button 
                onClick={handleGenerate} disabled={isLoading}
                className="w-full bg-mahogany text-gold font-display font-black py-4 rounded-lg uppercase text-[10px] tracking-[0.3em] shadow-xl"
              >
                {isLoading ? 'CONSULTANDO...' : 'ACTUALIZAR RÉGIMEN'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="space-y-4">
            {plan.length > 0 ? plan.map((item, idx) => (
              <div 
                key={idx} onClick={() => { if(!item.done) onComplete(); const p=[...plan]; p[idx].done=!p[idx].done; setPlan(p); }}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${item.done ? 'bg-white/5 border-white/20 opacity-40' : 'bg-stone-panel border-white/5'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{item.day}</span>
                  <span className="material-symbols-outlined text-white/60">{item.done ? 'task_alt' : 'circle'}</span>
                </div>
                <h4 className="text-white font-display font-black text-lg uppercase">{item.activity}</h4>
                <p className="text-white/40 text-[11px] italic mt-1">{item.details}</p>
              </div>
            )) : (
              <div className="py-20 text-center elevated-3d rounded-xl border-2 border-dashed border-white/5 opacity-20">
                 <span className="material-symbols-outlined text-5xl mb-4">fitness_center</span>
                 <p className="font-display font-bold uppercase text-xs">Sin plan de batalla</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitness;
