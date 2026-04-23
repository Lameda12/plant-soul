/**
 * PlantSoul design tokens — single source of truth for inline styles.
 * Mirrors the CSS custom properties defined in globals.css.
 */
export const brand = {
  colors: {
    black:        '#050505',
    forest:       '#0a2e1a',
    forestLight:  '#122b1c',
    forestMid:    '#0f2318',
    card:         '#0d1a10',
    cardHover:    '#111f14',
    border:       '#1a3a23',
    borderBright: '#2d6640',
    leaf:         '#4ade80',
    leafDim:      '#22c55e',
    leafFaint:    '#16a34a',
    text:         '#e8f5ec',
    textSub:      '#a3c4ab',
    muted:        '#6b8f73',
    dim:          '#3d5c44',
  },
  fonts: {
    sans:    'var(--font-inter), system-ui, sans-serif',
    heading: 'var(--font-space-grotesk), system-ui, sans-serif',
  },
  shadow: {
    glow:     '0 0 20px rgba(74,222,128,0.25), 0 0 60px rgba(74,222,128,0.08)',
    glowLg:   '0 0 32px rgba(74,222,128,0.4),  0 0 80px rgba(74,222,128,0.12)',
    card:     '0 8px 40px rgba(0,0,0,0.6)',
    cardHover:'0 16px 60px rgba(0,0,0,0.7)',
    inset:    'inset 0 0 0 1px rgba(74,222,128,0.18)',
  },
} as const

export type BrandColor = keyof typeof brand.colors
