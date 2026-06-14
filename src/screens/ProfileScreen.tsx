import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store';
import { colors, spacing, typography } from '../theme';

export const ProfileScreen: React.FC = () => {
  const { encryptionKey, connectedWearables, themeMode, setThemeMode, setOnboardingCompleted } = useAppStore();

  const handleReset = () => {
    setOnboardingCompleted(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Secure Settings</Text>
      <Text style={styles.desc}>
        Manage your local cryptographic vault, platform connections, and visual parameters.
      </Text>

      {/* Vault Key Card */}
      <View style={styles.card}>
        <Text style={styles.cardTag}>Cryptographic Key</Text>
        <Text style={styles.keyText} numberOfLines={1}>{encryptionKey || 'No secure key established'}</Text>
        <Text style={styles.cardFoot}>🛡️ Your key never leaves your physical hardware.</Text>
      </View>

      {/* Visual Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTag}>Visual Sanctuary Theme</Text>
        <View style={styles.themeRow}>
          <TouchableOpacity 
            style={[styles.themeBtn, themeMode === 'dark' && styles.themeBtnActive]}
            onPress={() => setThemeMode('dark')}
          >
            <Text style={[styles.themeText, themeMode === 'dark' && styles.themeTextActive]}>Abyss Premium (Dark)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.themeBtn, themeMode === 'light' && styles.themeBtnActive]}
            onPress={() => setThemeMode('light')}
          >
            <Text style={[styles.themeText, themeMode === 'light' && styles.themeTextActive]}>Serene Alabaster (Light)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Connected Wearables Status */}
      <View style={styles.card}>
        <Text style={styles.cardTag}>Linked Platforms</Text>
        {connectedWearables.length > 0 ? (
          connectedWearables.map((wearable) => (
            <View key={wearable} style={styles.wearableRow}>
              <Text style={styles.wearableText}>• {wearable}</Text>
              <Text style={styles.wearableActive}>Active Syncing</Text>
            </View>
          ))
        ) : (
          <Text style={styles.wearableNone}>No wearables linked. Add them in onboarding.</Text>
        )}
      </View>

      {/* Reset Device state */}
      <TouchableOpacity style={styles.btnDanger} onPress={handleReset}>
        <Text style={styles.btnDangerText}>Reset App Baseline State</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Fitbod Mobile App • Version 1.0.0 (Scaffold)</Text>
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
    color: '#7C4DFF', // Aura Indigo
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  keyText: {
    color: colors.dark.textHigh,
    fontSize: 13,
    fontFamily: 'Courier',
    backgroundColor: '#232635',
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  cardFoot: {
    color: colors.dark.textLow,
    fontSize: 10,
    marginTop: spacing.xs,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
  },
  themeBtn: {
    flex: 1,
    backgroundColor: '#232635',
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  themeBtnActive: {
    borderColor: '#05FF84', // Emerald
  },
  themeText: {
    color: colors.dark.textMid,
    fontSize: 11,
    fontWeight: '600',
  },
  themeTextActive: {
    color: '#05FF84',
    fontWeight: '700',
  },
  wearableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  wearableText: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.normal,
  },
  wearableActive: {
    color: '#05FF84',
    fontSize: 11,
    fontWeight: '700',
  },
  wearableNone: {
    color: colors.dark.textLow,
    fontSize: typography.sizes.normal,
  },
  btnDanger: {
    borderWidth: 1.5,
    borderColor: '#FF1744', // Coral Red
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  btnDangerText: {
    color: '#FF1744',
    fontSize: typography.sizes.normal,
    fontWeight: '700',
  },
  version: {
    color: colors.dark.textLow,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  }
});
export default ProfileScreen;
