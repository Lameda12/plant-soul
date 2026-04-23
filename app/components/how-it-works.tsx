'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { brand } from '@/app/lib/brand'

const STEPS = [
  {
    number: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
        <rect x="10" y="10" width="60" height="60" rx="12" stroke="currentColor" strokeWidth="5" fill="none" />
        <path d="M40 20C40 20 25 28 25 42C25 50.3 32 56 40 56C48 56 55 50.3 55 42C55 28 40 20 40 20Z" fill="currentColor" opacity="0.7" />
        <path d="M40 56L40 36" stroke="oklch(0.2 0.04 145)" strokeWidth="3" />
      </svg>
    ),
    title: 'Drop your plant photo',
    description: 'Upload any photo — a houseplant, garden flower, or wild specimen. Our scanner accepts anything with leaves.',
  },
  {
    number: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="6 4" />
        <circle cx="40" cy="40" r="10" fill="currentColor" opacity="0.7" />
        <path d="M40 12 L40 20 M40 60 L40 68 M12 40 L20 40 M60 40 L68 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    title: 'AI reads its soul signature',
    description: 'We map photosynthetic rhythms, growth patterns, and environmental response into a unique personality matrix.',
  },
  {
    number: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
        <path d="M15 55 L15 25 Q15 15 25 15 L55 15 Q65 15 65 25 L65 55 Q65 65 55 65 L25 65 Q15 65 15 55Z" stroke="currentColor" strokeWidth="5" fill="none" />
        <path d="M28 38 L36 46 L52 30" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Discover personality & traits',
    description: 'Your plant\'s archetype, emotional state, and hidden quirks reveal themselves in a full soul report.',
  },
  {
    number: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
        <rect x="22" y="8" width="36" height="52" rx="6" stroke="currentColor" strokeWidth="5" fill="none" />
        <path d="M32 20 L48 20 M32 30 L48 30 M32 40 L42 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M52 52 L68 68 M52 52 C52 52 58 46 62 50 C66 54 60 60 52 52Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    ),
    title: 'Share your plant\'s card',
    description: 'Download a holographic trading card — shareable on any platform, printable, and unmistakably yours.',
  },
]

function TimelineStep({
  step,
  index,
  isLast,
}: {
  step: typeof STEPS[number]
  index: number
  isLast: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} style={{ display: 'flex', gap: 0, position: 'relative' }}>
      {/* Left column: number + connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 64, flexShrink: 0 }}>
        {/* Circle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 22, delay: index * 0.1 }}
          style={{
            width: 52, height: 52,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brand.colors.forestLight}, ${brand.colors.card})`,
            border: `1px solid ${brand.colors.borderBright}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: brand.colors.leaf,
            boxShadow: isInView ? `0 0 20px rgba(74,222,128,0.2)` : 'none',
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          {step.icon}
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <div style={{ flex: 1, width: 1, position: 'relative', margin: '4px 0', overflow: 'hidden', minHeight: 48 }}>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to bottom, ${brand.colors.borderBright}, transparent)`,
                transformOrigin: 'top',
              }}
            />
          </div>
        )}
      </div>

      {/* Right column: content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay: index * 0.1 + 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ paddingLeft: 20, paddingBottom: isLast ? 0 : 52, paddingTop: 12 }}
      >
        <div style={{
          fontSize: 10, letterSpacing: '0.2em', fontWeight: 700,
          color: brand.colors.leafDim, marginBottom: 6,
          fontFamily: brand.fonts.sans,
        }}>
          STEP {step.number}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 700, color: brand.colors.text,
          letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.2,
          fontFamily: brand.fonts.heading,
        }}>
          {step.title}
        </div>
        <p style={{ fontSize: 14, color: brand.colors.muted, lineHeight: 1.7, margin: 0, maxWidth: 380, fontFamily: brand.fonts.sans }}>
          {step.description}
        </p>
      </motion.div>
    </div>
  )
}

export function HowItWorks() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })

  return (
    <section style={{
      padding: '100px 24px',
      borderTop: `1px solid ${brand.colors.border}`,
      background: brand.colors.black,
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 64 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: 16 }}
          >
            <span style={{
              fontSize: 11, letterSpacing: '0.2em',
              color: brand.colors.leaf,
              background: 'rgba(74,222,128,0.06)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: 999, padding: '5px 16px', fontWeight: 700,
              fontFamily: brand.fonts.sans,
            }}>
              HOW IT WORKS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.08 }}
            style={{
              textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800, color: brand.colors.text,
              letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 auto',
              fontFamily: brand.fonts.heading,
            }}
          >
            From photo to personality<br />in under 5 seconds
          </motion.h2>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {STEPS.map((step, i) => (
            <TimelineStep key={step.number} step={step} index={i} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
