
import { GoogleGenAI, Type } from "@google/genai";
import { StudyBlock, TrainingPlan, Quest, Deed, Exam, ShopItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudySchedule = async (availability: string, exams: Exam[]): Promise<StudyBlock[]> => {
  const examInfo = exams.map(e => `${e.subject} el día ${e.date}`).join(", ");
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Genera un "Calendario de Campaña de Sabiduría" de 7 días para un estudiante medieval. 
    - Disponibilidad: ${availability}.
    - Exámenes próximos: ${examInfo}.
    Prioriza las materias de los exámenes. El formato debe ser un JSON array de objetos StudyBlock.
    Cada bloque debe incluir 'day' (Lunes-Domingo), 'time', 'subject', 'description', 'xpReward' y 'goldReward'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            time: { type: Type.STRING },
            subject: { type: Type.STRING },
            description: { type: Type.STRING },
            xpReward: { type: Type.NUMBER },
            goldReward: { type: Type.NUMBER },
          },
          required: ["day", "time", "subject", "description", "xpReward", "goldReward"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateFitnessPlan = async (goals: string, currentWeight: string): Promise<TrainingPlan[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Genera un plan de fitness de 7 días en español para un escudero con objetivos: ${goals}. Formato JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            activity: { type: Type.STRING },
            details: { type: Type.STRING },
            done: { type: Type.BOOLEAN },
          },
          required: ["day", "activity", "details", "done"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateNewQuests = async (level: number): Promise<Quest[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Genera 3 misiones de productividad épicas en español para nivel ${level}. 
    - 'title': Un nombre épico.
    - 'description': Una instrucción clara de QUÉ DEBE HACER el usuario para completarla.
    - 'rewardGold': Entre 50 y 300.
    - 'rewardXp': Entre 100 y 500.
    JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            progress: { type: Type.NUMBER },
            target: { type: Type.NUMBER },
            completed: { type: Type.BOOLEAN },
            rewardGold: { type: Type.NUMBER },
            rewardXp: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ["study", "fitness", "social"] },
          },
          required: ["id", "title", "description", "progress", "target", "completed", "rewardGold", "rewardXp", "type"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateNewDeeds = async (): Promise<Deed[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Genera 4 "Hazañas de Caballería" en español. Tareas domésticas redactadas medievalmente. JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            task: { type: Type.STRING },
            category: { type: Type.STRING },
            completed: { type: Type.BOOLEAN },
          },
          required: ["id", "task", "category", "completed"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateShopItems = async (level: number): Promise<ShopItem[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Genera una lista de 8 artículos para una tienda medieval de productividad en español.
    Mezcla 2 categorías:
    1. 'avatar': Equipo como 'Armadura de Esmeralda', 'Yelmo de Oro de 24k', 'Escudo de Fénix'.
    2. 'real-life': "Autocompras" o permisos para la vida real redactados medievalmente (ej: 'Banquete de la Taberna' para pedir comida, 'Indulgencia de Ocio' para videojuegos, 'Nuevos Ropajes' para ropa real).
    
    Requisitos:
    - Precios entre 100 y 2000 oro.
    - Iconos de Material Symbols (ej: 'shield', 'helmet', 'restaurant', 'videogame_asset', 'shopping_bag').
    - El JSON debe ser un array de objetos con: id, name, desc, price, icon, category.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            desc: { type: Type.STRING },
            price: { type: Type.NUMBER },
            icon: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["avatar", "real-life"] },
          },
          required: ["id", "name", "desc", "price", "icon", "category"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};
