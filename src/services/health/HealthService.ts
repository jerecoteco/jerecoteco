import { Platform } from 'react-native';
import { HealthProvider, DailyMetricSummary } from './types';
import { mockHealthProvider } from './MockHealthProvider';

class HealthServiceManager {
  private activeProvider: HealthProvider;

  constructor() {
    // In dev, web, or simulator, default to Mock provider to ensure zero crashes and solid data representation
    this.activeProvider = mockHealthProvider;
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (Platform.OS === 'ios') {
      try {
        // Preparation for Apple HealthKit native integration
        // On actual device with HealthKit native modules compiled:
        // const { AppleHealthKitProvider } = require('./AppleHealthKitProvider');
        // this.activeProvider = new AppleHealthKitProvider();
      } catch (e) {
        console.warn('Native HealthKit implementation not loaded, falling back to Mock provider', e);
      }
    } else if (Platform.OS === 'android') {
      try {
        // Preparation for Google Fit / Android Health Connect native integration
        // const { GoogleFitProvider } = require('./GoogleFitProvider');
        // this.activeProvider = new GoogleFitProvider();
      } catch (e) {
        console.warn('Native Google Fit implementation not loaded, falling back to Mock provider', e);
      }
    }
  }

  getProviderName(): string {
    return this.activeProvider.name;
  }

  async isAvailable(): Promise<boolean> {
    return this.activeProvider.isAvailable();
  }

  async requestPermissions(): Promise<boolean> {
    return this.activeProvider.requestPermissions();
  }

  async getDailySummary(date: Date): Promise<DailyMetricSummary> {
    return this.activeProvider.getDailySummary(date);
  }

  async getWeightHistory(startDate: Date, endDate: Date): Promise<{ date: string; value: number }[]> {
    return this.activeProvider.getWeightHistory(startDate, endDate);
  }

  async getBloodPressureHistory(startDate: Date, endDate: Date): Promise<{ date: string; systolic: number; diastolic: number }[]> {
    return this.activeProvider.getBloodPressureHistory(startDate, endDate);
  }
}

export const HealthService = new HealthServiceManager();
