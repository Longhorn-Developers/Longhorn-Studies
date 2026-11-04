// Design tokens — the single source of truth.
// Used by tailwind.config.js (for classes) and by app code that needs raw
// values, e.g. icon colors: <ClockIcon color={tokens.icon.primary} />.

// ─── Primitives ────────────────────────────────────────────────
// Raw values. Prefer the semantic classes below in components.
const palette = {
  white: '#FFFFFF',
  orange: {
    50: '#FFF4EB',
    100: '#FCE4D0',
    200: '#F7C49C',
    300: '#EE9E5F',
    400: '#DE7A2C',
    500: '#BF5700', // UT burnt orange
    600: '#A34A00',
    700: '#8A3F00',
    800: '#6E3200',
    900: '#4F2400',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F3F6',
    200: '#E2E6EB',
    300: '#BAC1CC',
    400: '#94A3B8',
    500: '#64748B',
    600: '#4F5B66',
    700: '#3E4A54',
    800: '#333F48', // UT charcoal
    900: '#1A2024',
  },
  limestone: { 100: '#F5F4F0', 200: '#EAE8E1', 300: '#D6D2C4' },
  green: { 100: '#E8F3E4', 500: '#579D42', 700: '#3B7A2A' },
  amber: { 100: '#FEF0DC', 500: '#F8971F', 700: '#945400' },
  red: { 100: '#FCE9EC', 500: '#D10000', 700: '#A80000' },
};

// ─── Semantic tokens ───────────────────────────────────────────
const tokens = {
  text: {
    primary: palette.slate[800],
    secondary: palette.slate[500],
    disabled: palette.slate[400], // placeholder-only, never for info
    brand: palette.orange[500],
    'brand-strong': palette.orange[700], // orange text on tinted bg
    'on-brand': palette.white,
  },
  icon: {
    primary: palette.slate[800],
    secondary: palette.slate[500],
    brand: palette.orange[500],
  },
  bg: {
    page: palette.white,
    surface: palette.white,
    subtle: palette.slate[50],
    brand: palette.orange[500],
  },
  border: {
    default: palette.slate[300],
    subtle: palette.slate[200],
    strong: palette.slate[400],
    brand: palette.orange[500],
  },
  action: {
    primary: palette.orange[500],
    'primary-pressed': palette.orange[600],
    disabled: palette.slate[100],
  },
  filter: {
    'active-bg': palette.orange[100],
    'active-border': palette.orange[500],
    'active-text': palette.orange[700],
  },
  saved: {
    bg: palette.limestone[200],
    icon: palette.orange[500],
  },
  focus: {
    ring: palette.orange[500],
  },
  status: {
    'open-text': palette.green[700],
    'open-icon': palette.green[500],
    'open-bg': palette.green[100],
    'closing-text': palette.amber[700],
    'closing-icon': palette.amber[700],
    'closing-bg': palette.amber[100],
    'closed-text': palette.red[500],
    'closed-icon': palette.red[500],
    'closed-bg': palette.red[100],
  },
};

// ─── Typography ────────────────────────────────────────────────
// Figtree, loaded in src/app/_layout.tsx via @expo-google-fonts/figtree.
// In React Native each weight is its own font file, so weight is applied
// via font family — never fontWeight (Android fakes bold if you combine them).
const fonts = {
  regular: 'Figtree_400Regular',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
};

module.exports = { palette, tokens, fonts };
