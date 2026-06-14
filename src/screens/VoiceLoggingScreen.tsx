import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { VoiceService } from '../services/voice/VoiceService';
import { colors, spacing, typography } from '../theme';

export const VoiceLoggingScreen: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState('Tap microphone to speak your wellness log');
  const [parsingResult, setParsingResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulated typical voice logging phrases to make testing highly engaging
  const SAMPLE_PHRASES = [
    "My weight is 169.5 pounds",
    "Had a 520 calorie protein shake",
    "Worked out for forty five minutes",
    "Blood pressure is 118 over 74",
    "Feeling extremely tranquil and centered"
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setParsingResult(null);
    setStatusText('Listening to your wellness sanctuary...');
  };

  const handleStopAndParse = async (phrase?: string) => {
    setIsRecording(false);
    setIsProcessing(true);
    setStatusText('Processing local speech encryption...');

    // If no phrase passed, pick a random sample phrase for beautiful testing
    const selectedPhrase = phrase || SAMPLE_PHRASES[Math.floor(Math.random() * SAMPLE_PHRASES.length)];
    
    try {
      const result = await VoiceService.simulateVoiceLog(selectedPhrase);
      setParsingResult(result);
      if (result.dimension) {
        setStatusText('Successfully secure-logged to database!');
      } else {
        setStatusText('Uncertain transcript. Tap below to select manual.');
      }
    } catch (e) {
      setStatusText('Speech connection interrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Voice-First Logging</Text>
      <Text style={styles.desc}>
        Eliminate the tedious forms. Tap the node, speak naturally, and let our secure E2E system log it to your private vault instantly.
      </Text>

      {/* Mic Animation Pulse Container */}
      <View style={styles.micSection}>
        <TouchableOpacity 
          style={[
            styles.micNode,
            isRecording && styles.micNodeRecording,
            isProcessing && styles.micNodeProcessing
          ]}
          onPress={isRecording ? () => handleStopAndParse() : handleStartRecording}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="#090A0F" />
          ) : (
            <Text style={styles.micEmoji}>{isRecording ? '🎙️' : '🔘'}</Text>
          )}
        </TouchableOpacity>
        
        <Text style={[styles.statusText, isRecording && styles.statusTextActive]}>
          {statusText}
        </Text>
      </View>

      {/* Parsing Result Visual Box */}
      {parsingResult && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Decrypted Transaction</Text>
          <Text style={styles.transcript}>"{parsingResult.text}"</Text>
          
          {parsingResult.dimension ? (
            <View style={styles.parsingRow}>
              <Text style={styles.pillLabel}>
                Dimension: {colors.dimensions[parsingResult.parsedDimension].name}
              </Text>
              <Text style={[styles.pillValue, { color: colors.dimensions[parsingResult.parsedDimension].colorDark }]}>
                Value: {parsingResult.parsedValue}
              </Text>
            </View>
          ) : (
            <Text style={styles.parsingError}>
              ⚠️ System could not safely parse. Your text was saved to local raw journal.
            </Text>
          )}
        </View>
      )}

      {/* Suggested Quick Testing Phrases */}
      <View style={styles.suggestions}>
        <Text style={styles.suggestTitle}>Simulate Sample Phrases</Text>
        {SAMPLE_PHRASES.map((phrase, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.phraseRow}
            onPress={() => handleStopAndParse(phrase)}
            disabled={isRecording || isProcessing}
          >
            <Text style={styles.phraseText}>"{phrase}"</Text>
            <Text style={styles.phraseTap}>Tap to simulate</Text>
          </TouchableOpacity>
        ))}
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
  micSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  micNode: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#05FF84', // Emerald
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: 'rgba(5, 255, 132, 0.2)',
  },
  micNodeRecording: {
    backgroundColor: '#FF1744', // Coral Red
    borderColor: 'rgba(255, 23, 68, 0.2)',
  },
  micNodeProcessing: {
    backgroundColor: '#7C4DFF', // Aura Indigo
    borderColor: 'rgba(124, 77, 255, 0.2)',
  },
  micEmoji: {
    fontSize: 36,
  },
  statusText: {
    color: colors.dark.textMid,
    fontSize: typography.sizes.normal,
    marginTop: spacing.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  statusTextActive: {
    color: '#FF1744',
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#161722',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: spacing.lg,
  },
  resultTitle: {
    color: '#7C4DFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  transcript: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.large,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  parsingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#232635',
    padding: spacing.sm,
    borderRadius: 8,
  },
  pillLabel: {
    color: colors.dark.textHigh,
    fontWeight: '600',
    fontSize: 12,
  },
  pillValue: {
    fontWeight: '700',
    fontSize: 12,
  },
  parsingError: {
    color: colors.dark.textLow,
    fontSize: 11,
  },
  suggestions: {
    marginBottom: spacing.xxl,
  },
  suggestTitle: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.h3,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  phraseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161722',
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: spacing.xs,
  },
  phraseText: {
    color: colors.dark.textMid,
    fontSize: 12,
    fontStyle: 'italic',
  },
  phraseTap: {
    color: '#05FF84',
    fontSize: 11,
    fontWeight: '700',
  },
});
export default VoiceLoggingScreen;
