# Groupify Colors & Theming Guide

This document contains the complete color system and theming configuration for the Groupify app, adapted for React Native.

---

## Brand Colors

The app uses a signature **red-to-pink gradient** as the primary brand color:

### Primary Gradient
```typescript
// CSS: bg-gradient-to-r from-red-500 to-pink-500
// Hex approximation:
const primaryGradient = {
  start: '#ef4444', // red-500
  end: '#ec4899',  // pink-500
};
```

### Hover State
```typescript
// bg-gradient-to-r from-red-600 to-pink-600
const primaryGradientHover = {
  start: '#dc2626', // red-600
  end: '#db2777',  // pink-600
};
```

---

## Theme System

### Light Theme

| CSS Variable | HSL Value | Hex Approx | Usage |
|--------------|-----------|------------|-------|
| `--background` | `220 10% 98%` | `#fafafa` | Page background |
| `--foreground` | `220 10% 15%` | `#1f2937` | Primary text |
| `--card` | `0 0% 100%` | `#ffffff` | Card background |
| `--card-foreground` | `220 10% 15%` | `#1f2937` | Card text |
| `--popover` | `0 0% 100%` | `#ffffff` | Popover/modal bg |
| `--popover-foreground` | `220 10% 15%` | `#1f2937` | Popover text |
| `--primary` | `350 85% 55%` | `#f43f5e` | Primary actions (red-500) |
| `--primary-foreground` | `0 0% 100%` | `#ffffff` | Text on primary |
| `--secondary` | `220 10% 96%` | `#f3f4f6` | Secondary surfaces |
| `--secondary-foreground` | `220 10% 15%` | `#1f2937` | Text on secondary |
| `--muted` | `220 10% 96%` | `#f3f4f6` | Muted backgrounds |
| `--muted-foreground` | `220 10% 45%` | `#6b7280` | Muted text |
| `--accent` | `220 10% 94%` | `#f0f2f5` | Accent backgrounds |
| `--accent-foreground` | `220 10% 15%` | `#1f2937` | Text on accent |
| `--destructive` | `0 70% 50%` | `#dc2626` | Error/destructive |
| `--destructive-foreground` | `0 0% 100%` | `#ffffff` | Text on destructive |
| `--border` | `220 10% 85%` | `#d1d5db` | Borders |
| `--input` | `220 10% 85%` | `#d1d5db` | Input borders |
| `--ring` | `350 85% 55%` | `#f43f5e` | Focus rings |

### Dark Theme

| CSS Variable | HSL Value | Hex Approx | Usage |
|--------------|-----------|------------|-------|
| `--background` | `220 15% 8%` | `#0f172a` | Page background |
| `--foreground` | `220 10% 96%` | `#f1f5f9` | Primary text |
| `--card` | `220 12% 12%` | `#1e293b` | Card background |
| `--card-foreground` | `220 10% 96%` | `#f1f5f9` | Card text |
| `--popover` | `220 12% 14%` | `#1e293b` | Popover/modal bg |
| `--popover-foreground` | `220 10% 96%` | `#f1f5f9` | Popover text |
| `--primary` | `350 85% 60%` | `#fb7185` | Primary actions (lighter red) |
| `--primary-foreground` | `0 0% 100%` | `#ffffff` | Text on primary |
| `--secondary` | `220 10% 20%` | `#334155` | Secondary surfaces |
| `--secondary-foreground` | `220 10% 96%` | `#f1f5f9` | Text on secondary |
| `--muted` | `220 10% 15%` | `#1e293b` | Muted backgrounds |
| `--muted-foreground` | `220 10% 60%` | `#94a3b8` | Muted text |
| `--accent` | `220 10% 22%` | `#334155` | Accent backgrounds |
| `--accent-foreground` | `220 10% 96%` | `#f1f5f9` | Text on accent |
| `--destructive` | `0 70% 55%` | `#f87171` | Error/destructive |
| `--destructive-foreground` | `0 0% 100%` | `#ffffff` | Text on destructive |
| `--border` | `220 10% 25%` | `#334155` | Borders |
| `--input` | `220 10% 28%` | `#334155` | Input borders |
| `--ring` | `350 85% 60%` | `#fb7185` | Focus rings |

---

## React Native Color Constants

```typescript
// theme/colors.ts

export const colors = {
  // Light Theme
  light: {
    background: '#fafafa',
    foreground: '#1f2937',
    card: '#ffffff',
    cardForeground: '#1f2937',
    popover: '#ffffff',
    popoverForeground: '#1f2937',
    primary: '#f43f5e',        // Red-500
    primaryForeground: '#ffffff',
    secondary: '#f3f4f6',
    secondaryForeground: '#1f2937',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
    accent: '#f0f2f5',
    accentForeground: '#1f2937',
    destructive: '#dc2626',
    destructiveForeground: '#ffffff',
    border: '#d1d5db',
    input: '#d1d5db',
    ring: '#f43f5e',
    
    // Sidebar
    sidebar: '#fafafa',
    sidebarForeground: '#1f2937',
    sidebarPrimary: '#f43f5e',
    sidebarPrimaryForeground: '#ffffff',
    sidebarAccent: '#f0f2f5',
    sidebarAccentForeground: '#1f2937',
    sidebarBorder: '#d1d5db',
    sidebarRing: '#f43f5e',
  },

  // Dark Theme
  dark: {
    background: '#0f172a',
    foreground: '#f1f5f9',
    card: '#1e293b',
    cardForeground: '#f1f5f9',
    popover: '#1e293b',
    popoverForeground: '#f1f5f9',
    primary: '#fb7185',        // Lighter red for dark mode
    primaryForeground: '#ffffff',
    secondary: '#334155',
    secondaryForeground: '#f1f5f9',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    accent: '#334155',
    accentForeground: '#f1f5f9',
    destructive: '#f87171',
    destructiveForeground: '#ffffff',
    border: '#334155',
    input: '#334155',
    ring: '#fb7185',
    
    // Sidebar
    sidebar: '#0f172a',
    sidebarForeground: '#f1f5f9',
    sidebarPrimary: '#fb7185',
    sidebarPrimaryForeground: '#ffffff',
    sidebarAccent: '#334155',
    sidebarAccentForeground: '#f1f5f9',
    sidebarBorder: '#1e293b',
    sidebarRing: '#fb7185',
  },

  // Brand Gradient Colors
  gradient: {
    start: '#ef4444',  // red-500
    end: '#ec4899',   // pink-500
    startHover: '#dc2626',  // red-600
    endHover: '#db2777',   // pink-600
  },
};
```

---

## Gradients Used Throughout App

### Primary Action Button
```typescript
// Usage: Submit buttons, CTA buttons
const primaryButton = {
  backgroundColor: '#ef4444', // Fallback
  background: 'linear-gradient(to right, #ef4444, #ec4899)',
};
```

### Cards & Surfaces
```typescript
// bg-gradient-to-r from-red-500/5 to-pink-500/5
const subtleGradient = {
  backgroundColor: 'rgba(239, 68, 68, 0.05)',
  background: 'linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(236, 72, 153, 0.05))',
};
```

### Tabs Active State
```typescript
// data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500
const activeTabGradient = {
  background: 'linear-gradient(to right, #ef4444, #ec4899)',
};
```

### Avatar Fallback
```typescript
// bg-gradient-to-br from-red-500 to-pink-500
const avatarGradient = {
  background: 'linear-gradient(135deg, #ef4444, #ec4899)',
};
```

### Switch Checked State
```typescript
// data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-pink-500
const switchGradient = {
  background: 'linear-gradient(to right, #ef4444, #ec4899)',
};
```

---

## Usage Examples in React Native

### Creating the Gradient
```typescript
import { LinearGradient } from 'expo-linear-gradient';

// Primary button gradient
const ButtonGradient = () => (
  <LinearGradient
    colors={[colors.gradient.start, colors.gradient.end]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{ padding: 16, borderRadius: 8 }}
  >
    <Text style={{ color: '#fff' }}>Submit</Text>
  </LinearGradient>
);
```

### Theme Hook
```typescript
// hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { colors } from '@/theme/colors';

export function useTheme() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  return {
    theme,
    isDark: colorScheme === 'dark',
    gradient: colors.gradient,
  };
}
```

### Theme Context
```typescript
// context/ThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '@/theme/colors';

const ThemeContext = createContext(colors.light);

export function ThemeProvider({ children }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### Text Colors with Hex Values
```typescript
// Direct hex values for common text colors
export const textColors = {
  primary: '#1f2937',      // foreground light
  secondary: '#6b7280',   // muted-foreground
  tertiary: '#9ca3af',    // lighter muted
  inverse: '#f1f5f9',     // foreground dark
  accent: '#f43f5e',      // primary (red)
  error: '#dc2626',       // destructive
};
```

---

## Semantic Colors

### Status Colors
```typescript
export const statusColors = {
  success: '#22c55e',     // Green
  warning: '#f59e0b',     // Amber
  error: '#dc2626',       // Red
  info: '#3b82f6',       // Blue
};
```

### Category Colors (for Groups)
```typescript
export const categoryColors = {
  entertainment: '#ef4444',
  gaming: '#8b5cf6',
  education: '#3b82f6',
  tech: '#10b981',
  music: '#f59e0b',
  news: '#6366f1',
  sports: '#14b8a6',
  lifestyle: '#ec4899',
};
```

### Chart Colors
```typescript
// HSL values from CSS
export const chartColors = {
  light: ['#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b'],
  dark: ['#60a5fa', '#a78bfa', '#22d3ee', '#4ade80', '#fbbf24'],
};
```

---

## Shadows

### Light Theme Shadows
```typescript
export const shadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
};
```

### Dark Theme Shadows (stronger)
```typescript
export const shadowsDark = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
};
```

---

## Border Radius

```typescript
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  // Default radius --radius: 0.625rem (10px)
  default: 10,  
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};
```

---

## Key Color Principles

1. **Primary = Red-Pink Gradient**: All main CTAs use the gradient
2. **Light Mode = White backgrounds**: Cards and surfaces are white
3. **Dark Mode = Deep navy**: Background is `#0f172a`, cards are `#1e293b`
4. **Muted text**: Use for secondary info, timestamps, placeholders
5. **Borders**: Subtle in light mode, more visible in dark mode
6. **Focus rings**: Always use the primary (red) color

---

## Implementation Checklist

- [ ] Create `theme/colors.ts` with all color constants
- [ ] Create `ThemeContext` for app-wide theme access
- [ ] Create `useTheme` hook
- [ ] Implement `LinearGradient` for button components
- [ ] Add shadow constants for both themes
- [ ] Set up system color scheme detection
- [ ] Persist theme preference in AsyncStorage
- [ ] Test both light and dark modes throughout the app