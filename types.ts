
export enum Tab {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  FITNESS = 'FITNESS',
  SOCIAL = 'SOCIAL',
  SHOP = 'SHOP',
  ARMORY = 'ARMORY'
}

export type ArmorType = 'Leather' | 'Iron' | 'Steel' | 'Royal' | 'Silver';
export type HelmetType = 'Basic' | 'Great' | 'Visor' | 'Plumed' | 'Gold' | 'None';
export type CapeColor = '#4a0404' | '#0f172a' | '#1e293b' | '#581c87' | '#b45309'; 
export type ShieldType = 'Wood' | 'Heater' | 'Kite' | 'Buckler';
export type ShieldEmblem = 'None' | 'Lion' | 'Dragon' | 'Sun' | 'Cross';
export type MetalFinish = 'Standard' | 'Polished' | 'Worn';
export type HairStyle = 'Spiky' | 'Flowing' | 'Short' | 'Bald';
export type HairColor = '#fbbf24' | '#451a03' | '#1e293b' | '#ef4444' | '#3b82f6';
export type BeardStyle = 'None' | 'Stubble' | 'Full' | 'Goatee' | 'Van Dyke';
export type Expression = 'Neutral' | 'Fierce' | 'Peaceful' | 'Exhausted' | 'Victorious';

export interface AvatarConfig {
  armor: ArmorType;
  helmet: HelmetType;
  capeColor: CapeColor;
  shield: ShieldType;
  emblem: ShieldEmblem;
  finish: MetalFinish;
  hair: HairStyle;
  hairColor: HairColor;
  beard: BeardStyle;
  expression: Expression;
}

export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
  category: 'avatar' | 'real-life';
}

export interface UserStats {
  level: number;
  xp: number;
  maxXp: number;
  energy: number;
  gold: number;
  honors: number;
  streak: number;
  currentTitle: string;
  avatar: AvatarConfig;
  totalStudyHours: number;
  unlockedItems: string[]; 
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  rewardGold: number;
  rewardXp: number;
  type: 'study' | 'fitness' | 'social';
}

export interface Deed {
  id: string;
  task: string;
  category: string;
  completed: boolean;
  rewardGold?: number;
  rewardXp?: number;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
}

export interface StudyBlock {
  day: string;
  time: string;
  subject: string;
  description: string;
  xpReward: number;
  goldReward: number;
}

export interface TrainingPlan {
  day: string;
  activity: string;
  details: string;
  done: boolean;
}

export interface Title {
  id: string;
  name: string;
  unlocked: boolean;
  requirement: string;
}

export type ActiveDuels = Record<string, number>;
