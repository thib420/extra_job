export const Colors = {
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryLight: '#DCFCE7',
  secondary: '#1E3A5F',
  secondaryLight: '#2D5A8E',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  urgent: '#F59E0B',
  urgentLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#22C55E',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const CATEGORIES = [
  { value: 'jardinage', label: 'Jardinage', icon: '🌱' },
  { value: 'demenagement', label: 'Déménagement', icon: '📦' },
  { value: 'bricolage', label: 'Bricolage', icon: '🔧' },
  { value: 'menage', label: 'Ménage', icon: '🧹' },
  { value: 'evenement', label: 'Événement', icon: '🎉' },
  { value: 'courses', label: 'Courses', icon: '🛒' },
  { value: 'animaux', label: 'Animaux', icon: '🐾' },
  { value: 'informatique', label: 'Informatique', icon: '💻' },
  { value: 'cuisine', label: 'Cuisine', icon: '🍳' },
  { value: 'autre', label: 'Autre', icon: '📌' },
] as const;

export const DURATIONS = [
  { value: 1, label: '1 heure' },
  { value: 2, label: '2 heures' },
  { value: 3, label: '3 heures' },
  { value: 4, label: 'Demi-journée' },
  { value: 8, label: 'Journée' },
] as const;

export const RADIUS_OPTIONS = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
] as const;

export type CategoryValue = typeof CATEGORIES[number]['value'];
