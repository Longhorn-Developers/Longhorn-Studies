/** @type {import('tailwindcss').Config} */

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
// Exported so icon `color` props etc. can use the same values in JS.
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

// [size, lineHeight] in px. `.strong` = SemiBold, `.heavy` = Bold.
const typeScale = {
  'heading-lg': [28, 36, 'bold'],
  'heading-md': [23, 28, 'bold'],
  'heading-sm': [19, 24, 'bold'],
  'body-lg': [16, 22, 'regular'],
  'body-lg-strong': [16, 22, 'semibold'],
  'body-lg-heavy': [16, 22, 'bold'],
  'body-md': [13, 18, 'regular'],
  'body-md-strong': [13, 18, 'semibold'],
  'body-md-heavy': [13, 18, 'bold'],
  'body-sm': [12, 16, 'regular'],
  'body-sm-strong': [12, 16, 'semibold'],
  'body-sm-heavy': [12, 16, 'bold'],
};

// One class sets size + line height + font file: `text-body-md-strong`.
const typographyPlugin = ({ addUtilities }) => {
  addUtilities(
    Object.fromEntries(
      Object.entries(typeScale).map(([name, [size, lineHeight, weight]]) => [
        `.text-${name}`,
        {
          fontSize: `${size}px`,
          lineHeight: `${lineHeight}px`,
          fontFamily: fonts[weight],
        },
      ])
    )
  );
};

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')], // remove if not using NativeWind
  // NativeWind on web throws "Cannot manually set color scheme" with the default 'media'.
  darkMode: 'class',
  theme: {
    // Replaces Tailwind's default palette so only design-system colors exist.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...palette,
    },

    // 4px-based scale. Note: p-4 = 12px here, not Tailwind's 16px.
    spacing: {
      0: '0px',
      px: '1px',
      1: '2px',
      2: '4px',
      3: '8px',
      4: '12px',
      5: '16px',
      6: '20px',
      7: '24px',
      8: '32px',
    },

    borderRadius: {
      none: '0px',
      2: '8px', // rounded-2
      3: '16px', // rounded-3
      4: '32px', // rounded-4
      full: '9999px',
    },

    fontFamily: {
      figtree: [fonts.regular],
      'figtree-semibold': [fonts.semibold],
      'figtree-bold': [fonts.bold],
    },

    // Typography classes come from typographyPlugin (text-heading-lg, text-body-sm-strong …).
    // Tailwind's default text-sm/text-lg sizes are removed on purpose.
    fontSize: {},

    extend: {
      // text-primary, text-brand-strong, text-status-open, text-filter-active …
      textColor: {
        ...tokens.text,
        'icon-primary': tokens.icon.primary,
        'icon-secondary': tokens.icon.secondary,
        'icon-brand': tokens.icon.brand,
        'filter-active': tokens.filter['active-text'],
        'status-open': tokens.status['open-text'],
        'status-closing': tokens.status['closing-text'],
        'status-closed': tokens.status['closed-text'],
        'status-open-icon': tokens.status['open-icon'],
        'status-closing-icon': tokens.status['closing-icon'],
        'status-closed-icon': tokens.status['closed-icon'],
        'icon-saved': tokens.saved.icon,
      },
      // bg-page, bg-surface, bg-action-primary, bg-status-open …
      backgroundColor: {
        ...tokens.bg,
        'action-primary': tokens.action.primary,
        'action-primary-pressed': tokens.action['primary-pressed'],
        'action-disabled': tokens.action.disabled,
        'filter-active': tokens.filter['active-bg'],
        saved: tokens.saved.bg,
        'status-open': tokens.status['open-bg'],
        'status-closing': tokens.status['closing-bg'],
        'status-closed': tokens.status['closed-bg'],
      },
      // border-default, border-strong, border-filter-active …
      borderColor: {
        DEFAULT: tokens.border.default,
        ...tokens.border,
        'filter-active': tokens.filter['active-border'],
        focus: tokens.focus.ring,
      },
      ringColor: {
        focus: tokens.focus.ring,
      },
    },
  },
  plugins: [typographyPlugin],
};

module.exports.tokens = tokens;
module.exports.palette = palette;
module.exports.fonts = fonts;
