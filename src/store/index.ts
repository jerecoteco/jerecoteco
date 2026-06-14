import { create } from 'zustand';

export interface MetricLog {
  id: string;
  dimension: 'weight' | 'nutrition' | 'activity' | 'bloodPressure' | 'mood';
  value: string; // e.g., "165 lbs", "450 kcal", "45 mins", "120/80 mmHg", "Calm & Centered"
  rawValue: number; // For calculations
  timestamp: number;
  source: 'Manual' | 'Voice Log' | 'Apple Health' | 'Google Fit' | 'Fitbit' | 'Garmin';
  notes?: string;
}

export interface VoiceLogEntry {
  id: string;
  text: string;
  timestamp: number;
  parsedDimension?: 'weight' | 'nutrition' | 'activity' | 'bloodPressure' | 'mood';
  parsedValue?: string;
  isProcessing: boolean;
  success: boolean;
}

interface AppState {
  // Onboarding & Security
  onboardingCompleted: boolean;
  encryptionKey: string | null;
  connectedWearables: string[];
  themeMode: 'dark' | 'light';

  // Health Metrics
  bodyResonanceScore: number;
  metricLogs: MetricLog[];
  voiceLogs: VoiceLogEntry[];

  // Actions
  setOnboardingCompleted: (completed: boolean) => void;
  setEncryptionKey: (key: string | null) => void;
  toggleWearable: (wearable: string) => void;
  setThemeMode: (mode: 'dark' | 'light') => void;
  
  addMetricLog: (log: Omit<MetricLog, 'id' | 'timestamp'>) => void;
  removeMetricLog: (id: string) => void;
  
  addVoiceLog: (text: string, parsedDimension?: MetricLog['dimension'], parsedValue?: string) => void;
  recalculateBRS: () => void;
}

// Initial default metric logs for a realistic starting dashboard state
const DEFAULT_LOGS: MetricLog[] = [
  {
    id: '1',
    dimension: 'weight',
    value: '168.4 lbs',
    rawValue: 168.4,
    timestamp: Date.now() - 3600000 * 4, // 4 hours ago
    source: 'Garmin',
    notes: 'Morning weight after waking up'
  },
  {
    id: '2',
    dimension: 'nutrition',
    value: '620 kcal',
    rawValue: 620,
    timestamp: Date.now() - 3600000 * 6, // 6 hours ago
    source: 'Manual',
    notes: 'Avocado toast and protein shake'
  },
  {
    id: '3',
    dimension: 'activity',
    value: '42 mins',
    rawValue: 42,
    timestamp: Date.now() - 3600000 * 24, // Yesterday
    source: 'Apple Health',
    notes: 'Outdoor cardio run'
  },
  {
    id: '4',
    dimension: 'bloodPressure',
    value: '118/76 mmHg',
    rawValue: 118, // Systolic
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    source: 'Manual',
    notes: 'Sitting calmly at desk'
  },
  {
    id: '5',
    dimension: 'mood',
    value: 'Highly Focused (8/10)',
    rawValue: 8,
    timestamp: Date.now() - 3600000 * 1, // 1 hour ago
    source: 'Voice Log',
    notes: 'Log entry: "Felt very productive after morning workout"'
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  onboardingCompleted: false,
  encryptionKey: null,
  connectedWearables: [],
  themeMode: 'dark',
  bodyResonanceScore: 78, // Realistic starting score
  metricLogs: DEFAULT_LOGS,
  voiceLogs: [],

  setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
  
  setEncryptionKey: (key) => set({ encryptionKey: key }),
  
  toggleWearable: (wearable) => set((state) => {
    const isConnected = state.connectedWearables.includes(wearable);
    const updated = isConnected
      ? state.connectedWearables.filter(w => w !== wearable)
      : [...state.connectedWearables, wearable];
    return { connectedWearables: updated };
  }),

  setThemeMode: (mode) => set({ themeMode: mode }),

  addMetricLog: (log) => {
    const newLog: MetricLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    };
    
    set((state) => ({
      metricLogs: [newLog, ...state.metricLogs]
    }));
    
    // Dynamically recalculate resonance score
    get().recalculateBRS();
  },

  removeMetricLog: (id) => {
    set((state) => ({
      metricLogs: state.metricLogs.filter(log => log.id !== id)
    }));
    
    get().recalculateBRS();
  },

  addVoiceLog: (text, parsedDimension, parsedValue) => {
    const newVoiceLog: VoiceLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      timestamp: Date.now(),
      parsedDimension,
      parsedValue,
      isProcessing: false,
      success: !!parsedDimension
    };

    set((state) => ({
      voiceLogs: [newVoiceLog, ...state.voiceLogs]
    }));

    // If successfully parsed, add as a metric log immediately!
    if (parsedDimension && parsedValue) {
      let rawVal = 0;
      if (parsedDimension === 'weight') rawVal = parseFloat(parsedValue) || 150;
      else if (parsedDimension === 'nutrition') rawVal = parseFloat(parsedValue) || 500;
      else if (parsedDimension === 'activity') rawVal = parseFloat(parsedValue) || 30;
      else if (parsedDimension === 'bloodPressure') rawVal = parseFloat(parsedValue.split('/')[0]) || 120;
      else if (parsedDimension === 'mood') rawVal = 7; // Good

      get().addMetricLog({
        dimension: parsedDimension,
        value: parsedValue,
        rawValue: rawVal,
        source: 'Voice Log',
        notes: `Voice log: "${text}"`
      });
    }
  },

  recalculateBRS: () => {
    const logs = get().metricLogs;
    if (logs.length === 0) {
      set({ bodyResonanceScore: 0 });
      return;
    }

    // A beautiful holistic calculation formula:
    // It weights your latest logs across the 5 dimensions.
    // Optimal values: 
    // - BP systolic closest to 120 gets highest score
    // - Weight: presence of log gets steady contribution
    // - Nutrition: active tracking gives standard positive points
    // - Activity: active minutes up to 60mins increases score
    // - Mood: scale of 1-10 directly maps to score
    
    const latestByDimension: Record<string, MetricLog> = {};
    for (const log of logs) {
      if (!latestByDimension[log.dimension]) {
        latestByDimension[log.dimension] = log;
      }
    }

    let scoreAccumulator = 60; // Base score
    const dimensionsCount = Object.keys(latestByDimension).length;

    // 1. Weight impact (Grounding mass)
    if (latestByDimension.weight) {
      scoreAccumulator += 5; // Steady state contribution
    }

    // 2. Nutrition impact (Hydration/energy)
    if (latestByDimension.nutrition) {
      const kcal = latestByDimension.nutrition.rawValue;
      if (kcal > 1500 && kcal < 2800) scoreAccumulator += 8; // Optimal fueling zone
      else scoreAccumulator += 4;
    }

    // 3. Activity impact (Circulation/heat)
    if (latestByDimension.activity) {
      const mins = latestByDimension.activity.rawValue;
      if (mins >= 30 && mins <= 90) scoreAccumulator += 10; // Great workout recovery balance
      else if (mins > 0) scoreAccumulator += 5;
    }

    // 4. Blood Pressure impact (Pulse resonance)
    if (latestByDimension.bloodPressure) {
      const systolic = latestByDimension.bloodPressure.rawValue;
      const bpDev = Math.abs(systolic - 120);
      if (bpDev <= 5) scoreAccumulator += 10; // Excellent clinical pulse
      else if (bpDev <= 15) scoreAccumulator += 5; // Normal pulse
      else scoreAccumulator -= 10; // High anxiety/cardio pulse deviation
    }

    // 5. Mood impact (Mental serenity)
    if (latestByDimension.mood) {
      const moodVal = latestByDimension.mood.rawValue;
      const moodScore = Math.min(10, Math.max(1, moodVal));
      scoreAccumulator += (moodScore - 5) * 1.5; // Scale up/down based on mood
    }

    // Extra points for holistic balance (multiple dimensions tracked)
    scoreAccumulator += dimensionsCount * 2;

    // Cap at 100, floor at 10
    const finalBRS = Math.round(Math.min(100, Math.max(10, scoreAccumulator)));
    set({ bodyResonanceScore: finalBRS });
  }
}));
