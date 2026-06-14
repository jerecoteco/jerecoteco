import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../theme';

export const InsightsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Holistic Insights</Text>
      <Text style={styles.desc}>
        Fitbod translates raw integers into dynamic personal medicine. By merging your wearable records, we discover how your biological metrics interact over time.
      </Text>

      {/* Holistic Correlation Widget */}
      <View style={styles.card}>
        <Text style={styles.cardTag}>Significant Correlation Detected</Text>
        <Text style={styles.cardTitle}>Sleep quality vs Blood Pressure</Text>
        <Text style={styles.cardDesc}>
          Based on the last 7 nights of Garmin sleep records and manual BP logs, a 15% increase in deep sleep duration correlates with a 5mmHg reduction in systolic blood pressure.
        </Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>92% Correlation Strength • Strong</Text>
        </View>
      </View>

      {/* AI Health Brief */}
      <View style={styles.aiBriefCard}>
        <Text style={styles.aiBriefTitle}>✨ AI Health Brief</Text>
        <Text style={styles.aiBriefText}>
          Your overall Body Resonance Score (78) is trending upwards this week, primarily driven by consistent outdoor cardio runs (Activity) and improved mood ratings. Hydration levels (Nutrition) remain 10% below goal—consider voice-logging an extra glass of water post-workout.
        </Text>
      </View>

      {/* Security metaphorical stamp */}
      <View style={styles.stamp}>
        <Text style={styles.stampText}>🔐 Analytical models computed locally. Zero cloud profiles.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.h2,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  desc: {
    color: colors.dark.textMid,
    fontSize: typography.sizes.normal,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: '#161722',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: spacing.md,
  },
  cardTag: {
    color: '#FF9100', // Amber
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.xxs,
  },
  cardTitle: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.h3,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  cardDesc: {
    color: colors.dark.textMid,
    fontSize: typography.sizes.normal,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 145, 0, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FF9100',
    fontSize: 11,
    fontWeight: '600',
  },
  aiBriefCard: {
    backgroundColor: '#161722',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#7C4DFF', // Aura Indigo
    marginBottom: spacing.lg,
  },
  aiBriefTitle: {
    color: '#7C4DFF',
    fontSize: typography.sizes.large,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  aiBriefText: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.normal,
    lineHeight: 20,
  },
  stamp: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  stampText: {
    color: colors.dark.textLow,
    fontSize: 11,
  },
});
export default InsightsScreen;
