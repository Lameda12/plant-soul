import { brand } from '@/app/lib/brand'

interface LogoProps {
  size?: number
  variant?: 'mark' | 'lockup' | 'lockup-sm'
  pulse?: boolean
  className?: string
  style?: React.CSSProperties
}

/** Minimal leaf mark with a soul-glow at the root */
export function LogoMark({ size = 32, pulse = false }: { size?: number; pulse?: boolean }) {
  const id = `soul-glow-${size}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={pulse ? 'logo-pulse' : undefined}
      aria-label="PlantSoul mark"
    >
      <defs>
        {/* Soul glow radial gradient behind the orb */}
        <radialGradient id={`${id}-orb`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#4ade80" stopOpacity="0.9" />
          <stop offset="60%"  stopColor="#22c55e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </radialGradient>
        {/* Leaf gradient */}
        <linearGradient id={`${id}-leaf`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>

      {/* Soul glow bloom — sits below everything */}
      <ellipse
        cx="16"
        cy="33"
        rx="10"
        ry="6"
        fill={`url(#${id}-orb)`}
        opacity="0.7"
      />

      {/* Leaf body */}
      <path
        d="M20 4 C20 4 7 12 7 24 C7 32 13 37 20 37 C27 37 33 32 33 24 C33 12 20 4 20 4Z"
        fill={`url(#${id}-leaf)`}
        opacity="0.95"
      />

      {/* Centre vein */}
      <path
        d="M20 37 L20 10"
        stroke="#0a2e1a"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Side veins */}
      <path
        d="M20 18 Q14 22 13 28"
        stroke="#0a2e1a"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M20 24 Q26 26 27 32"
        stroke="#0a2e1a"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Soul orb — glowing dot at the root */}
      <circle cx="20" cy="36" r="2.5" fill="#4ade80" />
      <circle cx="20" cy="36" r="1.2" fill="#fff" opacity="0.8" />
    </svg>
  )
}

/** Full logo lockup: mark + wordmark */
export function Logo({ size = 32, variant = 'lockup', pulse = false, className, style }: LogoProps) {
  if (variant === 'mark') return <LogoMark size={size} pulse={pulse} />

  const isSmall = variant === 'lockup-sm'
  const markSize = isSmall ? 22 : size
  const wordSize = isSmall ? 15 : Math.round(size * 0.5)
  const tagSize  = isSmall ? 9  : Math.round(size * 0.28)

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        ...style,
        alignItems: 'center',
        gap: isSmall ? 8 : 10,
        textDecoration: 'none',
      }}
    >
      <LogoMark size={markSize} pulse={pulse} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: wordSize,
            fontWeight: 700,
            color: brand.colors.text,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Plant<span style={{ color: brand.colors.leaf }}>Soul</span>
        </span>
        {!isSmall && (
          <span
            style={{
              fontFamily: brand.fonts.sans,
              fontSize: tagSize,
              color: brand.colors.muted,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: 1,
            }}
          >
            Botanical AI
          </span>
        )}
      </div>
    </div>
  )
}
