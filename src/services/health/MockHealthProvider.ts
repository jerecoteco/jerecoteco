import { HealthProvider, DailyMetricSummary } from './types';

export class MockHealthProvider implements HealthProvider {
  name = 'Mock Wearable Platform';

  async isAvailable(): Promise<boolean> {
    return true; // Always available in development/simulation
  }

  async requestPermissions(): Promise<boolean> {
    return true; // Instantly granted
  }

  async getDailySummary(date: Date): Promise<DailyMetricSummary> {
    const dateString = date.toISOString().split('T')[0];
    
    // Generate realistic, organic wellness metrics for the given date
    const daySeed = date.getDate();
    const weightBase = 168.0;
    const weightVariance = Math.sin(daySeed) * 1.2;
    
    return {
      date: dateString,
      weight: parseFloat((weightBase + weightVariance).toFixed(1)),
      steps: 6000 + (daySeed * 250) % 8000,
      caloriesBurned: 1800 + (daySeed * 50) % 1200,
      caloriesConsumed: 2000 + (daySeed * 80) % 1000,
      bloodPressureSystolic: 115 + (daySeed % 12),
      bloodPressureDiastolic: 73 + (daySeed % 8),
      sleepMinutes: 380 + (daySeed * 15) % 160, // ~6 to ~9 hours
      moodScore: 6 + (daySeed % 5), // 6 to 10 scale
    };
  }

  async getWeightHistory(startDate: Date, endDate: Date): Promise<{ date: string; value: number }[]> {
    const history: { date: string; value: number }[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const daySeed = current.getDate();
      const value = parseFloat((168.0 + Math.sin(daySeed) * 1.5).toFixed(1));
      
      history.push({ date: dateStr, value });
      current.setDate(current.getDate() + 1);
    }

    return history;
  }

  async getBloodPressureHistory(startDate: Date, endDate: Date): Promise<{ date: string; systolic: number; diastolic: number }[]> {
    const history: { date: string; systolic: number; diastolic: number }[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const daySeed = current.getDate();
      
      history.push({
        date: dateStr,
        systolic: 115 + (daySeed % 12),
        diastolic: 73 + (daySeed % 8),
      });
      current.setDate(current.getDate() + 1);
    }

    return history;
  }
}
export const mockHealthProvider = new MockHealthProvider();
