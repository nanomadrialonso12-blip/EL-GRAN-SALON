
import React from 'react';
import { AvatarConfig } from '../types';

interface KnightAvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

const KnightAvatar: React.FC<KnightAvatarProps> = ({ config, size = 200, className = "" }) => {
  const getArmorMaterials = (tier: string) => {
    switch(tier) {
      case 'Leather': return { primary: '#4a3728', secondary: '#2a1a0f', shine: 'rgba(255,255,255,0.05)' };
      case 'Iron': return { primary: '#4b5563', secondary: '#1f2937', shine: 'rgba(255,255,255,0.1)' };
      case 'Steel': return { primary: '#94a3b8', secondary: '#475569', shine: 'rgba(255,255,255,0.2)' };
      case 'Royal': return { primary: '#d4af37', secondary: '#78350f', shine: 'rgba(255,255,255,0.4)' };
      case 'Silver': return { primary: '#f8fafc', secondary: '#cbd5e1', shine: 'rgba(255,255,255,0.8)' };
      default: return { primary: '#4b5563', secondary: '#1f2937', shine: 'rgba(255,255,255,0.1)' };
    }
  };

  const mat = getArmorMaterials(config.armor);

  const renderHair = () => {
    const hairColor = config.hairColor;
    switch(config.hair) {
      case 'Spiky':
        return (
          <path 
            d="M36 18 L32 5 L42 10 L50 0 L58 10 L68 5 L64 18 L72 12 L70 25 L30 25 L28 12 Z" 
            fill={hairColor} 
            stroke="black" strokeWidth="0.5"
            className="drop-shadow-sm"
          />
        );
      case 'Flowing':
        return (
          <path 
            d="M32 18 Q50 -10 68 18 L78 45 Q50 60 22 45 Z" 
            fill={hairColor} 
            stroke="black" strokeWidth="0.5"
          />
        );
      case 'Short':
        return (
          <path 
            d="M35 15 Q50 2 65 15 L68 28 Q50 22 32 28 Z" 
            fill={hairColor} 
            stroke="black" strokeWidth="0.5"
          />
        );
      default: return null;
    }
  };

  const renderBeard = () => {
    const beardColor = config.hairColor; // Usually same as hair
    switch(config.beard) {
      case 'Stubble':
        return <path d="M38 35 Q50 48 62 35 L60 38 Q50 50 40 38 Z" fill={beardColor} opacity="0.4" />;
      case 'Goatee':
        return (
          <g>
            <path d="M46 38 L54 38 L50 48 Z" fill={beardColor} />
            <path d="M42 34 L58 34 L58 35 L42 35 Z" fill={beardColor} /> {/* Small mustache stub */}
          </g>
        );
      case 'Full':
        return (
          <path d="M38 30 Q35 55 50 58 Q65 55 62 30 L60 28 Q50 35 40 28 Z" fill={beardColor} stroke="black" strokeWidth="0.2" />
        );
      case 'Van Dyke':
        return (
          <g>
            <path d="M45 40 L55 40 L50 52 Z" fill={beardColor} />
            <path d="M38 32 Q50 38 62 32 L62 34 Q50 40 38 34 Z" fill={beardColor} />
          </g>
        );
      default: return null;
    }
  };

  const renderExpression = () => {
    const eyeColor = "#1e293b";
    switch(config.expression) {
      case 'Fierce':
        return (
          <g transform="translate(35, 20)">
            {/* Angry brows */}
            <path d="M5 2 L12 6" stroke={eyeColor} strokeWidth="2" />
            <path d="M25 2 L18 6" stroke={eyeColor} strokeWidth="2" />
            <circle cx="8" cy="10" r="2" fill={eyeColor} />
            <circle cx="22" cy="10" r="2" fill={eyeColor} />
            <path d="M12 20 Q15 15 18 20" stroke={eyeColor} strokeWidth="1.5" fill="none" />
          </g>
        );
      case 'Peaceful':
        return (
          <g transform="translate(35, 20)">
            <path d="M5 10 Q8 6 11 10" stroke={eyeColor} strokeWidth="1.5" fill="none" />
            <path d="M19 10 Q22 6 25 10" stroke={eyeColor} strokeWidth="1.5" fill="none" />
            <path d="M10 22 Q15 26 20 22" stroke={eyeColor} strokeWidth="1" fill="none" />
          </g>
        );
      case 'Exhausted':
        return (
          <g transform="translate(35, 20)">
            <ellipse cx="8" cy="12" rx="3" ry="1.5" fill={eyeColor} opacity="0.6" />
            <ellipse cx="22" cy="12" rx="3" ry="1.5" fill={eyeColor} opacity="0.6" />
            <path d="M12 24 L18 24" stroke={eyeColor} strokeWidth="2" opacity="0.5" />
          </g>
        );
      case 'Victorious':
        return (
          <g transform="translate(35, 20)">
            <circle cx="8" cy="10" r="2.5" fill={eyeColor} />
            <circle cx="22" cy="10" r="2.5" fill={eyeColor} />
            <path d="M8 20 Q15 28 22 20" stroke={eyeColor} strokeWidth="2" fill="none" />
          </g>
        );
      default: // Neutral
        return (
          <g transform="translate(35, 20)">
            <circle cx="8" cy="10" r="2" fill={eyeColor} />
            <circle cx="22" cy="10" r="2" fill={eyeColor} />
            <path d="M12 22 L18 22" stroke={eyeColor} strokeWidth="1.5" />
          </g>
        );
    }
  };

  return (
    <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
        <defs>
          <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mat.primary} />
            <stop offset="50%" stopColor={mat.secondary} />
            <stop offset="100%" stopColor={mat.primary} />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d="M15 40 Q50 35 85 40 L95 100 L5 100 Z" fill={config.capeColor} opacity="0.9" />
        <path d="M25 45 Q50 40 75 45 L70 85 Q50 90 30 85 Z" fill="url(#armorGrad)" />
        
        {/* Relieve del Peto */}
        <path d="M40 50 Q50 45 60 50 L58 75 Q50 78 42 75 Z" fill="black" opacity="0.2" />

        {/* Cabeza / Rostro */}
        <rect x="35" y="12" width="30" height="35" rx="10" fill="#fecaca" stroke="#d1a3a3" strokeWidth="0.5" />
        
        {renderHair()}
        {renderBeard()}
        {renderExpression()}

        {/* Yelmo (Helmet) */}
        {config.helmet !== 'None' && (
          <g filter="url(#shadow)">
            <path d="M32 8 Q50 -5 68 8 L72 45 Q50 52 28 45 Z" fill="url(#armorGrad)" />
            {/* Visera */}
            <path d="M35 22 L65 22 L65 32 L35 32 Z" fill="black" opacity="0.6" />
            {config.helmet === 'Gold' && (
              <path d="M45 2 L50 -6 L55 2" fill="none" stroke="#d4af37" strokeWidth="3" />
            )}
          </g>
        )}

        <path d="M20 45 Q25 40 35 45 L32 60 Q25 58 20 55 Z" fill="url(#armorGrad)" />
        <path d="M80 45 Q75 40 65 45 L68 60 Q75 58 80 55 Z" fill="url(#armorGrad)" />
      </svg>
    </div>
  );
};

export default KnightAvatar;
