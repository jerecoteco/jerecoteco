import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, G } from 'react-native-svg';
import { colors } from '../../theme';
import { useAppStore } from '../../store';

interface ResonanceChartProps {
  height?: number;
}

export const ResonanceChart: React.FC<ResonanceChartProps> = ({ height = 180 }) => {
  const { bodyResonanceScore, metricLogs } = useAppStore();
  const screenWidth = Dimensions.get('window').width - 48; // Account for card margins

  // Find recent metrics to dynamically adjust wave heights and highlights
  const hasMood = metricLogs.some(l => l.dimension === 'mood');
  const hasBP = metricLogs.some(l => l.dimension === 'bloodPressure');
  const hasActivity = metricLogs.some(l => l.dimension === 'activity');

  // Wave equations based on BRS and logged metrics
  const wave1Amplitude = 15 + (bodyResonanceScore / 10);
  const wave2Amplitude = 10 + (hasMood ? 12 : 5);
  const wave3Amplitude = 8 + (hasBP ? 10 : 4) + (hasActivity ? 5 : 0);

  // SVG Path generation (harmonic waves)
  const generateWavePath = (amplitude: number, frequency: number, phase: number, yOffset: number) => {
    let path = `M 0 ${yOffset}`;
    for (let x = 0; x <= screenWidth; x += 10) {
      const y = yOffset + amplitude * Math.sin((x / screenWidth) * Math.PI * 2 * frequency + phase);
      path += ` L ${x} ${y}`;
    }
    path += ` L ${screenWidth} ${height} L 0 ${height} Z`;
    return path;
  };

  const wave1Path = generateWavePath(wave1Amplitude, 1.2, 0, height - 60);
  const wave2Path = generateWavePath(wave2Amplitude, 2.0, Math.PI / 3, height - 55);
  const wave3Path = generateWavePath(wave3Amplitude, 1.5, Math.PI / 1.5, height - 50);

  return (
    <View style={[styles.container, { height }]}>
      {/* Background visual container */}
      <Svg width={screenWidth} height={height} style={styles.svg}>
        <Defs>
          {/* Emerald Wave Gradient */}
          <LinearGradient id="wave1Grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.dark.brandPrimary} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={colors.dark.bgSurface} stopOpacity={0.0} />
          </LinearGradient>

          {/* Aura Indigo Wave Gradient */}
          <LinearGradient id="wave2Grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.dark.brandSecondary} stopOpacity={0.25} />
            <Stop offset="100%" stopColor={colors.dark.bgSurface} stopOpacity={0.0} />
          </LinearGradient>

          {/* Cyan/Water Wave Gradient */}
          <LinearGradient id="wave3Grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.dimensions.nutrition.colorDark} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={colors.dark.bgSurface} stopOpacity={0.0} />
          </LinearGradient>
        </Defs>

        {/* Render Waves (Layered, interconnected waveforms) */}
        <Path d={wave3Path} fill="url(#wave3Grad)" />
        <Path d={wave2Path} fill="url(#wave2Grad)" />
        <Path d={wave1Path} fill="url(#wave1Grad)" />

        {/* Dynamic visual indicator node on the primary wave */}
        <G>
          <Circle
            cx={screenWidth * 0.7}
            cy={height - 60 + wave1Amplitude * Math.sin((0.7 * Math.PI * 2 * 1.2))}
            r={6}
            fill={colors.dark.brandPrimary}
          />
          <Circle
            cx={screenWidth * 0.7}
            cy={height - 60 + wave1Amplitude * Math.sin((0.7 * Math.PI * 2 * 1.2))}
            r={12}
            fill="none"
            stroke={colors.dark.brandPrimary}
            strokeWidth={1.5}
            opacity={0.5}
          />
        </G>
      </Svg>

      {/* Floating details on the chart */}
      <View style={styles.overlayTextContainer}>
        <Text style={styles.scoreTitle}>Body Resonance</Text>
        <Text style={styles.scoreSub}>{bodyResonanceScore}% harmonic harmony</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#161722', // Card surface background
    borderWidth: 1,
    borderColor: '#2D3142',
  },
  svg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  overlayTextContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  scoreTitle: {
    color: '#F5F6FA',
    fontSize: 18,
    fontWeight: '600',
  },
  scoreSub: {
    color: '#05FF84', // Primary emerald
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
export default ResonanceChart;
