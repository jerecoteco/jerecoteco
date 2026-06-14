import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useAppStore } from '../store';
import { colors, spacing, typography } from '../theme';

export const OnboardingScreen: React.FC = () => {
  const { setOnboardingCompleted, setEncryptionKey, connectedWearables, toggleWearable } = useAppStore();
  const [step, setStep] = useState(1);
  const [keyInput, setKeyInput] = useState('');
  const [bpBaseline, setBpBaseline] = useState('120/80');

  const handleGenerateKey = () => {
    const generated = 'fitbod_sec_' + Math.random().toString(36).substring(2, 15);
    setKeyInput(generated);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Finalize onboarding
      setEncryptionKey(keyInput || 'fitbod_sec_local_default_key');
      setOnboardingCompleted(true);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Fitbod</Text>
        <Text style={styles.brandSub}>Private Wellness Sanctuary</Text>
      </View>

      {/* Steps Indicators */}
      <View style={styles.stepContainer}>
        {[1, 2, 3].map((s) => (
          <View 
            key={s} 
            style={[
              styles.stepDot, 
              step >= s ? styles.stepDotActive : styles.stepDotInactive
            ]} 
          />
        ))}
      </View>

      {/* Step 1: Privacy and Cryptographic Key */}
      {step === 1 && (
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>Absolute Sanctuary</Text>
          <Text style={styles.stepDesc}>
            Your health data is highly sensitive. We protect it using zero-knowledge end-to-end encryption. Generate your local private cryptographic key to secure your logs.
          </Text>

          <TouchableOpacity style={styles.btnSec} onPress={handleGenerateKey}>
            <Text style={styles.btnSecText}>Generate Secure Key</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={keyInput}
            onChangeText={setKeyInput}
            placeholder="or paste your custom encryption key"
            placeholderTextColor={colors.dark.textLow}
          />
          <Text style={styles.securityLabel}>🛡️ Local-only execution. No central tracking.</Text>
        </View>
      )}

      {/* Step 2: Wearable Integrations */}
      {step === 2 && (
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>Connect Wearables</Text>
          <Text style={styles.stepDesc}>
            Fitbod acts as a single, beautiful unified hub for all your fitness gadgets. Connect any of your platforms securely:
          </Text>

          {['Apple Health', 'Google Fit', 'Garmin Connect', 'Fitbit Hub'].map((platform) => {
            const isConnected = connectedWearables.includes(platform);
            return (
              <TouchableOpacity 
                key={platform} 
                style={[styles.platformRow, isConnected && styles.platformRowConnected]}
                onPress={() => toggleWearable(platform)}
              >
                <Text style={styles.platformName}>{platform}</Text>
                <Text style={[styles.platformStatus, isConnected && styles.platformStatusConnected]}>
                  {isConnected ? '✓ Connected' : 'Connect'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Step 3: Biometric Baseline */}
      {step === 3 && (
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>Biometric Baseline</Text>
          <Text style={styles.stepDesc}>
            Help us set your scientific wellness benchmarks to calibrate your Body Resonance Score correctly:
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Typical Blood Pressure</Text>
            <TextInput
              style={styles.input}
              value={bpBaseline}
              onChangeText={setBpBaseline}
              placeholder="e.g. 120/80 mmHg"
              placeholderTextColor={colors.dark.textLow}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Target Weight Goal (lbs)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 165 lbs"
              placeholderTextColor={colors.dark.textLow}
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

      {/* Bottom CTA Button Stack */}
      <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
        <Text style={styles.btnPrimaryText}>
          {step === 3 ? 'Enter Sanctuary' : 'Next Step'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F', // Abyss Deep
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  brandTitle: {
    color: '#05FF84', // Emerald
    fontSize: typography.sizes.displayBRS,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  brandSub: {
    color: colors.dark.textMid,
    fontSize: typography.sizes.large,
    marginTop: spacing.xxs,
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  stepDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: '#05FF84',
  },
  stepDotInactive: {
    backgroundColor: colors.dark.border,
  },
  stepCard: {
    backgroundColor: '#161722',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: spacing.lg,
  },
  stepTitle: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.h2,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  stepDesc: {
    color: colors.dark.textMid,
    fontSize: typography.sizes.normal,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.dark.textMid,
    fontSize: typography.sizes.caption,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  input: {
    backgroundColor: '#232635',
    borderRadius: 8,
    color: colors.dark.textHigh,
    padding: spacing.sm,
    fontSize: typography.sizes.normal,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  btnPrimary: {
    backgroundColor: '#05FF84', // Emerald
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  btnPrimaryText: {
    color: '#090A0F', // Obsidian
    fontSize: typography.sizes.large,
    fontWeight: '700',
  },
  btnSec: {
    borderWidth: 1.5,
    borderColor: '#7C4DFF', // Aura Indigo
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  btnSecText: {
    color: '#7C4DFF',
    fontSize: typography.sizes.normal,
    fontWeight: '600',
  },
  platformRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#232635',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: spacing.xs,
  },
  platformRowConnected: {
    borderColor: '#05FF84',
  },
  platformName: {
    color: colors.dark.textHigh,
    fontWeight: '600',
    fontSize: typography.sizes.normal,
  },
  platformStatus: {
    color: colors.dark.textMid,
    fontSize: typography.sizes.caption,
  },
  platformStatusConnected: {
    color: '#05FF84',
    fontWeight: '700',
  },
  securityLabel: {
    color: colors.dark.textLow,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
  }
});
