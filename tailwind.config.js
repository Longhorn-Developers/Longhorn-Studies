/** @type {import('tailwindcss').Config} */

const { palette, tokens, fonts } = require('./src/theme/tokens');

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

