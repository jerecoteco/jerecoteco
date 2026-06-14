export interface DailyMetricSummary {
  date: string;
  weight?: number; // in lbs
  steps?: number;
  caloriesBurned?: number;
  caloriesConsumed?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  sleepMinutes?: number;
  moodScore?: number; // 1-10
}

export interface HealthProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  getDailySummary(date: Date): Promise<DailyMetricSummary>;
  getWeightHistory(startDate: Date, endDate: Date): Promise<{ date: string; value: number }[]>;
  getBloodPressureHistory(startDate: Date, endDate: Date): Promise<{ date: string; systolic: number; diastolic: number }[]>;
}
