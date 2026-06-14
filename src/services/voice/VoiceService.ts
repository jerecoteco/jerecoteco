import { useAppStore } from '../../store';

export interface VoiceParsingResult {
  text: string;
  dimension?: 'weight' | 'nutrition' | 'activity' | 'bloodPressure' | 'mood';
  value?: string;
  confidence: number; // 0-1
}

class VoiceServiceManager {
  /**
   * Parses freeform natural text transcript into structured Fitbod health metrics
   */
  parseTranscript(text: string): VoiceParsingResult {
    const normalized = text.toLowerCase().trim();
    
    // 1. Weight patterns (e.g. "My weight is 165 pounds", "Logged weight 172.5")
    const weightRegex = /(?:weight|weigh|weighed)\s*(?:is|at|of)?\s*(\d+(?:\.\d+)?)\s*(?:lbs|pounds|lb|kg|kilos)?/;
    const weightMatch = normalized.match(weightRegex);
    if (weightMatch) {
      const val = parseFloat(weightMatch[1]);
      const unit = normalized.includes('kg') || normalized.includes('kilo') ? 'kg' : 'lbs';
      return {
        text,
        dimension: 'weight',
        value: `${val} ${unit}`,
        confidence: 0.95
      };
    }

    // 2. Nutrition patterns (e.g. "Had a 450 calorie shake", "Ate 600 calories for dinner")
    const nutritionRegex = /(?:ate|consumed|had|meal|calories|calorie)\s*(\d+)\s*(?:kcal|calories|calorie)?/;
    const nutritionMatch = normalized.match(nutritionRegex);
    if (nutritionMatch) {
      const calories = parseInt(nutritionMatch[1], 10);
      return {
        text,
        dimension: 'nutrition',
        value: `${calories} kcal`,
        confidence: 0.90
      };
    }

    // 3. Activity patterns (e.g. "Ran forty-five minutes", "Workout for 30 mins", "Exercised for 1 hour")
    const activityRegex = /(?:ran|workout|worked out|exercised|activity|cardio|minutes|mins)\s*(?:for)?\s*(\d+)\s*(?:mins|minutes|minute|hour|hours|hr)?/;
    const activityMatch = normalized.match(activityRegex);
    if (activityMatch) {
      let mins = parseInt(activityMatch[1], 10);
      // Handle "1 hour" conversion
      if (normalized.includes('hour') || normalized.includes('hr')) {
        mins = mins * 60;
      }
      return {
        text,
        dimension: 'activity',
        value: `${mins} mins`,
        confidence: 0.88
      };
    }

    // 4. Blood pressure patterns (e.g. "Blood pressure is 120 over 80", "BP 118 over 74")
    const bpRegex = /(?:blood pressure|bp|pressure)\s*(?:is|at|of)?\s*(\d+)\s*(?:over|\/)\s*(\d+)/;
    const bpMatch = normalized.match(bpRegex);
    if (bpMatch) {
      const systolic = bpMatch[1];
      const diastolic = bpMatch[2];
      return {
        text,
        dimension: 'bloodPressure',
        value: `${systolic}/${diastolic} mmHg`,
        confidence: 0.98
      };
    }

    // 5. Mood patterns (e.g. "Feeling extremely tranquil", "Mood is very positive", "Super stressed out")
    if (normalized.includes('mood') || normalized.includes('feeling') || normalized.includes('feel')) {
      let moodText = "Calm";
      let scale = 7;
      
      if (normalized.includes('tranquil') || normalized.includes('serene') || normalized.includes('peaceful') || normalized.includes('calm')) {
        moodText = "Serene & Peaceful";
        scale = 9;
      } else if (normalized.includes('great') || normalized.includes('happy') || normalized.includes('positive') || normalized.includes('awesome')) {
        moodText = "Great & Energetic";
        scale = 8;
      } else if (normalized.includes('stress') || normalized.includes('anxious') || normalized.includes('tired') || normalized.includes('bad')) {
        moodText = "Stressed & Tired";
        scale = 4;
      } else if (normalized.includes('focus') || normalized.includes('productive')) {
        moodText = "Highly Focused";
        scale = 8;
      }
      
      return {
        text,
        dimension: 'mood',
        value: `${moodText} (${scale}/10)`,
        confidence: 0.85
      };
    }

    // Fallback: Default if not parsed
    return {
      text,
      confidence: 0.10
    };
  }

  /**
   * Simulates capturing audio and converting to text, then parses to global store
   */
  async simulateVoiceLog(transcriptText: string): Promise<VoiceParsingResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.parseTranscript(transcriptText);
        
        // Push result directly to Zustand store if we matched a dimension!
        const store = useAppStore.getState();
        store.addVoiceLog(result.text, result.dimension, result.value);
        
        resolve(result);
      }, 1500); // 1.5s simulated network/speech processing lag
    });
  }
}

export const VoiceService = new VoiceServiceManager();
