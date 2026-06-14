/**
 * Fitbod UI Design Tokens & Theme Specification
 * Implements the official Fitbod Design System V1.0.0
 */

import { Platform } from 'react-native';

export const colors = {
  // Abyss Premium (Dark Mode — Primary Default)
  dark: {
    bgBase: '#090A0F',      // Obsidian Deep
    bgSurface: '#161722',   // Card & Container
    bgElevate: '#232635',   // Text Input & Drop-downs
    border: '#2D3142',      // Dividers & Outlines
    textHigh: '#F5F6FA',    // Arctic White (Primary text)
    textMid: '#A5A9BC',     // Mist (Secondary labels)
    textLow: '#52576C',     // Placeholders, disabled states
    brandPrimary: '#05FF84', // Emerald Resonance (CTA highlights)
    brandSecondary: '#7C4DFF', // Aura Indigo (Premium accents)
  },
  // Serene Alabaster (Light Mode)
  light: {
    bgBase: '#F4F6F9',      // Alabaster Dew
    bgSurface: '#FFFFFF',   // Pure Snow (Card background)
    bgElevate: '#E8EBF0',   // Pearl Veil
    border: '#DBE1E9',      // Divider lines
    textHigh: '#111217',    // Obsidian Ink
    textMid: '#5D6375',     // Slate
    textLow: '#ADB4C6',     // Inactive placeholder
    brandPrimary: '#00A859', // Forest Resonance
    brandSecondary: '#512DA8', // Royal Aura
  },
  // Dimension Specific Tokens (Immutable across themes)
  dimensions: {
    weight: {
      key: 'weight',
      name: 'Weight',
      colorDark: '#FF9100', // Warm Amber
      colorLight: '#E65100', // Deep Amber
      bgTint: 'rgba(255, 145, 0, 0.1)',
    },
    nutrition: {
      key: 'nutrition',
      name: 'Nutrition',
      colorDark: '#00E5FF', // Seafoam Mint (Cyan)
      colorLight: '#00838F', // Dark Cyan
      bgTint: 'rgba(0, 229, 255, 0.1)',
    },
    activity: {
      key: 'activity',
      name: 'Activity',
      colorDark: '#FF1744', // Radiant Coral Red
      colorLight: '#D50000', // Red
      bgTint: 'rgba(255, 23, 68, 0.1)',
    },
    bloodPressure: {
      key: 'bloodPressure',
      name: 'Blood Pressure',
      colorDark: '#D500F9', // Amethyst Lavender (Magenta)
      colorLight: '#8E24AA', // Purple
      bgTint: 'rgba(213, 0, 249, 0.1)',
    },
    mood: {
      key: 'mood',
      name: 'Mood',
      colorDark: '#2979FF', // Ocean Cerulean (Blue)
      colorLight: '#1565C0', // Dark Blue
      bgTint: 'rgba(41, 121, 255, 0.1)',
    }
  }
};

export const spacing = {
  xxs: 4,   // Tiny sub-label adjustments
  xs: 8,    // Padding inside card, label distance
  sm: 12,   // Compact widgets, list rows
  md: 16,   // Standard spacing, screen margin
  lg: 24,   // Independent card blocks, button stacks
  xl: 32,   // Page header content separation
  xxl: 48,  // Onboarding top/bottom padding
};

export const typography = {
  // Satoshi or Inter system sans-serif scale
  fontFamily: {
    base: 'System', // Satoshi/Inter fallback
    mono: 'System', // JetBrains Mono/Space Mono fallback (Platform-specific styles used below)
  },
  sizes: {
    displayBRS: 64, // 0-100 BRS Display
    h1: 32,         // Large Onboarding / Headers
    h2: 24,         // Dashboard sections
    h3: 18,         // Card headers
    large: 16,      // AI Brief text, Onboarding copy
    normal: 14,     // Body normal copy
    boldLabel: 12,  // Category pills, uppercase buttons
    caption: 12,    // Subtexts, timestamps
    monoStat: 20,   // Metrics numbers
  },
  // High-legibility styles
  styles: {
    displayBRS: {
      fontSize: 64,
      fontWeight: '900' as const,
      lineHeight: 72,
      letterSpacing: -1.28,
    },
    h1Title: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.32,
    },
    h2Section: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 30,
      letterSpacing: 0,
    },
    h3Card: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 22,
      letterSpacing: 0,
    },
    bodyNormal: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    labelBold: {
      fontSize: 12,
      fontWeight: '700' as const,
      lineHeight: 16,
      letterSpacing: 0.12,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0,
    },
    monoStat: {
      fontSize: 20,
      fontWeight: '500' as const,
      lineHeight: 24,
      letterSpacing: 0,
      ...PlatformSelectMono(),
    }
  }
};

function PlatformSelectMono() {
  // Returns appropriate monospaced typography configurations across platforms
  return {
    fontFamily: 'Courier', // Standard cross-platform monospaced font
  };
}
