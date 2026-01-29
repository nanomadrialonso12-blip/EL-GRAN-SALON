
import React, { useState } from 'react';
import { generateStudySchedule } from '../services/geminiService';
import { StudyBlock, Exam } from '../types';

interface StudyProps {
  timeLeft: number;
  isRunning: boolean;
  mode: 'pomodoro' | 'study';
  totalStudyHours: number;
  sessionSeconds: number;
  activeDuelsCount: number;
  onToggle: () => void;
  onReset: () => void;
  onSetMode: (mode: 'pomodoro' | 'study') => void;
  t: any;
}

const Study: React.FC<StudyProps> = ({ 
  timeLeft, isRunning, mode, totalStudyHours, sessionSeconds, activeDuelsCount,
  onToggle, onReset, onSetMode, t 
}) => {
  const [availability, setAvailability] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [schedule, setSchedule] = useState<StudyBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTimeInMode = mode === 'pomodoro' ? 25 * 60 : 50 * 60;
  const progressPercent = (timeLeft / totalTimeInMode) * 100;

  return (
    <div className="flex flex-col gap-6 md:gap-10 pb-10">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-10">
        {/* Orbe de Enfoque Adaptado */}
        <div className="col-span-12 lg:col-span-8 flex flex-col items-center justify-center elevated-3d rounded-3xl p-6 md:p-16 relative overflow-hidden bg-[#0d0e0f]">
          <div className="flex justify-between w-full mb-8">
            <div className="text-left">
              <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Saber</p>
              <p className="text-xl font-display font-bold">{totalStudyHours.toFixed(1)}h</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Modo</p>
              <p className="text-xl font-display font-bold uppercase">{mode}</p>
            </div>
          </div>

          <div className="relative size-[70vw] max-size-[320px] md:size-[400px] flex items-center justify-center">
            <svg className="absolute inset-0 size-full -rotate-90">
              <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#222" strokeWidth="8" />
              <circle 
                cx="50%" cy="50%" r="46%" fill="none" stroke="white" strokeWidth="8" 
                strokeDasharray="100 100" strokeDashoffset={100 - progressPercent}
                className="transition-all duration-500"
                style={{ strokeDasharray: 'calc(2 * 3.14159 * 46%)', strokeDashoffset: `calc(2 * 3.14159 * 46% * (1 - ${timeLeft / totalTimeInMode}))` }}
              />
            </svg>
            <div className="text-center z-10">
              <div className="text-5xl md:text-7xl font-black tabular-nums font-display">{formatTime(timeLeft)}</div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 w-full md:w-auto">
            <button 
              onClick={onToggle} 
              className={`flex-1 md:px-12 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 ${
                isRunning ? 'bg-red-950/20 border-red-500 text-red-500' : 'bg-white text-black border-white'
              }`}
            >
              {isRunning ? 'Detener' : 'Comenzar'}
            </button>
            <button onClick={onReset} className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase">
              <span className="material-symbols-outlined text-sm">refresh</span>
            </button>
          </div>
          
          <div className="mt-6 flex gap-4 bg-white/5 p-1 rounded-full">
             <button onClick={() => onSetMode('pomodoro')} className={`px-4 py-1 text-[9px] font-black rounded-full transition-all ${mode === 'pomodoro' ? 'bg-white text-black' : 'text-white/40'}`}>POMODORO</button>
             <button onClick={() => onSetMode('study')} className={`px-4 py-1 text-[9px] font-black rounded-full transition-all ${mode === 'study' ? 'bg-white text-black' : 'text-white/40'}`}>ENFOQUE</button>
          </div>
        </div>

        {/* Exámenes Adaptados */}
        <div className="col-span-12 lg:col-span-4 parchment-texture p-6 md:p-10 rounded-xl border-[8px] md:border-[12px] border-mahogany">
          <h3 className="text-amber-950 font-display font-black text-xl md:text-2xl uppercase mb-6 border-b border-mahogany/10 pb-4">EXÁMENES</h3>
          <div className="space-y-4">
            <input 
              type="text" value={newExamSubject} onChange={(e) => setNewExamSubject(e.target.value)}
              placeholder="Asignatura..."
              className="w-full bg-transparent border-b border-mahogany/20 p-2 text-sm font-bold text-amber-950 outline-none"
            />
            <div className="flex gap-2">
              <input type="date" value={newExamDate} onChange={(e) => setNewExamDate(e.target.value)} className="flex-1 bg-transparent border-b border-mahogany/20 p-2 text-[10px] font-bold text-amber-950 outline-none" />
              <button onClick={() => { if(newExamSubject) setExams([...exams, {id: Date.now().toString(), subject: newExamSubject, date: newExamDate}]); setNewExamSubject(''); }} className="bg-mahogany text-gold px-4 rounded text-[10px] font-black uppercase">Añadir</button>
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-2 mt-4 custom-scrollbar">
              {exams.map(e => (
                <div key={e.id} className="flex justify-between items-center bg-white/20 p-3 rounded border border-mahogany/5">
                  <span className="text-amber-950 text-xs font-black uppercase">{e.subject}</span>
                  <button onClick={() => setExams(exams.filter(ex => ex.id !== e.id))}><span className="material-symbols-outlined text-red-900 text-sm">delete</span></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;
