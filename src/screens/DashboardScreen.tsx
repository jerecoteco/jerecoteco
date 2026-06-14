import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useAppStore, MetricLog } from '../store';
import { colors, spacing, typography } from '../theme';
import { ResonanceChart } from '../components/charts/ResonanceChart';

export const DashboardScreen: React.FC = () => {
  const { bodyResonanceScore, metricLogs, addMetricLog, removeMetricLog } = useAppStore();
  
  // Local state for quick manual logs
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDim, setSelectedDim] = useState<MetricLog['dimension']>('weight');
  const [logValue, setLogValue] = useState('');
  const [logNotes, setLogNotes] = useState('');

  // Get latest value for each dimension
  const getLatestValue = (dim: MetricLog['dimension']) => {
    const logs = metricLogs.filter(l => l.dimension === dim);
    return logs.length > 0 ? logs[0].value : 'No record';
  };

  const handleAddLog = () => {
    if (!logValue.trim()) return;

    let rawVal = 0;
    if (selectedDim === 'weight') rawVal = parseFloat(logValue) || 150;
    else if (selectedDim === 'nutrition') rawVal = parseFloat(logValue) || 500;
    else if (selectedDim === 'activity') rawVal = parseFloat(logValue) || 30;
    else if (selectedDim === 'bloodPressure') rawVal = parseFloat(logValue.split('/')[0]) || 120;
    else if (selectedDim === 'mood') rawVal = parseFloat(logValue) || 7;

    addMetricLog({
      dimension: selectedDim,
      value: logValue,
      rawValue: rawVal,
      source: 'Manual',
      notes: logNotes || undefined
    });

    // Reset and close
    setLogValue('');
    setLogNotes('');
    setShowAddModal(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Dashboard Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Good Morning,</Text>
          <Text style={styles.subtitle}>Your health sanctuary is in harmony</Text>
        </View>
        <TouchableOpacity style={styles.themeToggle}>
          <Text style={styles.themeToggleText}>💎 Premium</Text>
        </TouchableOpacity>
      </View>

      {/* Flagship Body Resonance Score Chart */}
      <View style={styles.resonanceSection}>
        <ResonanceChart height={180} />
        <View style={styles.brsBadge}>
          <Text style={styles.brsNumber}>{bodyResonanceScore}</Text>
          <Text style={styles.brsLabel}>BRS</Text>
        </View>
      </View>

      {/* The 5 Core Dimensions Grid */}
      <Text style={styles.sectionTitle}>Pillars of Resonance</Text>
      <View style={styles.grid}>
        {Object.values(colors.dimensions).map((dim) => {
          const latestVal = getLatestValue(dim.key as any);
          return (
            <TouchableOpacity 
              key={dim.key} 
              style={styles.card}
              onPress={() => {
                setSelectedDim(dim.key as any);
                setShowAddModal(true);
              }}
            >
              <View style={[styles.indicatorLine, { backgroundColor: dim.colorDark }]} />
              <Text style={styles.cardTitle}>{dim.name}</Text>
              <Text style={[styles.cardValue, { color: dim.colorDark }]}>{latestVal}</Text>
              <Text style={styles.cardTap}>+ Tap to log</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Manual Logger Overlay / Form */}
      {showAddModal && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Log {colors.dimensions[selectedDim].name}</Text>
          
          <TextInput
            style={styles.input}
            value={logValue}
            onChangeText={setLogValue}
            placeholder={
              selectedDim === 'weight' ? 'e.g. 165 lbs' :
              selectedDim === 'nutrition' ? 'e.g. 450 kcal' :
              selectedDim === 'activity' ? 'e.g. 45 mins' :
              selectedDim === 'bloodPressure' ? 'e.g. 118/76' : 'e.g. Calm (8/10)'
            }
            placeholderTextColor={colors.dark.textLow}
          />

          <TextInput
            style={styles.input}
            value={logNotes}
            onChangeText={setLogNotes}
            placeholder="Add context notes (optional)"
            placeholderTextColor={colors.dark.textLow}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAddModal(false)}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.btnSave} onPress={handleAddLog}>
              <Text style={styles.btnSaveText}>Save Metric</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recent Activity / Logs List */}
      <View style={styles.logsSection}>
        <Text style={styles.sectionTitle}>Recent Logs</Text>
        {metricLogs.slice(0, 5).map((log) => {
          const dimInfo = colors.dimensions[log.dimension];
          return (
            <View key={log.id} style={styles.logRow}>
              <View style={[styles.logIcon, { backgroundColor: dimInfo.bgTint }]}>
                <Text style={{ color: dimInfo.colorDark, fontWeight: '700' }}>
                  {log.dimension.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.logMeta}>
                <Text style={styles.logLabel}>{dimInfo.name}</Text>
                <Text style={styles.logSource}>{log.source} • {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
              </View>
              <View style={styles.logValueContainer}>
                <Text style={[styles.logValue, { color: dimInfo.colorDark }]}>{log.value}</Text>
                <TouchableOpacity onPress={() => removeMetricLog(log.id)}>
                  <Text style={styles.logDelete}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F', // Abyss base
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  welcome: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.h2,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.dark.textMid,
    fontSize: typography.sizes.caption,
    marginTop: 2,
  },
  themeToggle: {
    backgroundColor: '#232635',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  themeToggleText: {
    color: '#05FF84',
    fontSize: 12,
    fontWeight: '700',
  },
  resonanceSection: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  brsBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#232635',
    padding: spacing.xs,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark.border,
    minWidth: 50,
  },
  brsNumber: {
    color: '#05FF84',
    fontSize: typography.sizes.h2,
    fontWeight: '900',
  },
  brsLabel: {
    color: colors.dark.textMid,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.h3,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  card: {
    width: '48%',
    backgroundColor: '#161722',
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark.border,
    position: 'relative',
    overflow: 'hidden',
  },
  indicatorLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  cardTitle: {
    color: colors.dark.textMid,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: typography.sizes.large,
    fontWeight: '700',
    marginVertical: spacing.xxs,
  },
  cardTap: {
    color: colors.dark.textLow,
    fontSize: 10,
  },
  modal: {
    backgroundColor: '#161722',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#7C4DFF',
    marginVertical: spacing.xs,
  },
  modalTitle: {
    color: colors.dark.textHigh,
    fontSize: typography.sizes.large,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: '#232635',
    color: colors.dark.textHigh,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  btnCancel: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  btnCancelText: {
    color: colors.dark.textMid,
  },
  btnSave: {
    backgroundColor: '#05FF84',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  btnSaveText: {
    color: '#090A0F',
    fontWeight: '700',
  },
  logsSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161722',
    padding: spacing.sm,
    borderRadius: 12,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  logIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  logMeta: {
    flex: 1,
  },
  logLabel: {
    color: colors.dark.textHigh,
    fontWeight: '600',
    fontSize: typography.sizes.normal,
  },
  logSource: {
    color: colors.dark.textLow,
    fontSize: 11,
    marginTop: 1,
  },
  logNotes: {
    color: colors.dark.textMid,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  logValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logValue: {
    fontWeight: '700',
    fontSize: typography.sizes.normal,
    marginRight: spacing.xs,
  },
  logDelete: {
    color: colors.dark.textLow,
    fontSize: 14,
    padding: 4,
  },
});
