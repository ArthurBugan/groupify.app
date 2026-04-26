/**
 * Maps uniwind theme CSS variables to raw color strings.
 * Used for native components (BottomSheet, Portal) that sit outside
 * the CSS tree and can't consume tailwind classes.
 */

export const themeColors = {
  light: {
    background: 'hsl(220 10% 98%)',
    foreground: 'hsl(220 10% 15%)',
    card: 'hsl(0 0% 100%)',
    popover: 'hsl(0 0% 100%)',
    primary: 'hsl(350 85% 55%)',
    'primary-foreground': 'hsl(0 0% 100%)',
    secondary: 'hsl(220 10% 96%)',
    muted: 'hsl(220 10% 96%)',
    'muted-foreground': 'hsl(220 10% 45%)',
    border: 'hsl(220 10% 85%)',
    input: 'hsl(220 10% 85%)',
    destructive: 'hsl(0 70% 50%)',
  },
  dark: {
    background: 'hsl(220 15% 8%)',
    foreground: 'hsl(220 10% 96%)',
    card: 'hsl(220 12% 12%)',
    popover: 'hsl(220 12% 14%)',
    primary: 'hsl(350 85% 60%)',
    'primary-foreground': 'hsl(0 0% 100%)',
    secondary: 'hsl(220 10% 20%)',
    muted: 'hsl(220 10% 15%)',
    'muted-foreground': 'hsl(220 10% 60%)',
    border: 'hsl(220 10% 25%)',
    input: 'hsl(220 10% 28%)',
    destructive: 'hsl(0 70% 50%)',
  },
};

export type ThemeColorKey = keyof typeof themeColors.light;

export function getThemeColor(key: ThemeColorKey, isDark: boolean): string {
  const theme = isDark ? themeColors.dark : themeColors.light;
  return theme[key];
}
