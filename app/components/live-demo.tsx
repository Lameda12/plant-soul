'use client'

import {
  useState, useRef, useCallback, lazy, Suspense, useEffect,
} from 'react'
import {
  motion, AnimatePresence, useSpring, useTransform,
  useMotionValue, animate,
} from 'framer-motion'
import { brand } from '@/app/lib/brand'

const ShareCardPreview = lazy(() =>
  import('./share-card').then((m) => ({ default: m.ShareCardPreview }))
)

// ── Audio ─────────────────────────────────────────────────────────────────────
let _actx: AudioContext | null = null
function actx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!_actx) _actx = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return _actx
}
function sfxDrop() {
  const c = actx(); if (!c) return
  const buf = c.createBuffer(1, c.sampleRate * 0.22, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5)
  const src = c.createBufferSource(); src.buffer = buf
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 350
  const g = c.createGain(); g.gain.value = 0.55
  src.connect(f); f.connect(g); g.connect(c.destination); src.start()
  const o = c.createOscillator(); const og = c.createGain()
  o.type = 'sine'; o.frequency.setValueAtTime(120, c.currentTime)
  o.frequency.exponentialRampToValueAtTime(480, c.currentTime + 0.22)
  og.gain.setValueAtTime(0.18, c.currentTime); og.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.22)
  o.connect(og); og.connect(c.destination); o.start(); o.stop(c.currentTime + 0.22)
}
function sfxAnalyzing() {
  const c = actx(); if (!c) return
  const o = c.createOscillator(); const g = c.createGain()
  o.type = 'sine'; o.frequency.setValueAtTime(55, c.currentTime)
  o.frequency.linearRampToValueAtTime(180, c.currentTime + 2.6)
  g.gain.setValueAtTime(0.07, c.currentTime); g.gain.linearRampToValueAtTime(0, c.currentTime + 2.6)
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 2.6)
}
function sfxReveal() {
  const c = actx(); if (!c) return
  ;[261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((freq, i) => {
    const o = c.createOscillator(); const g = c.createGain()
    o.type = 'triangle'; o.frequency.value = freq
    const t = c.currentTime + i * 0.07
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + 0.04)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9)
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.9)
  })
}
function sfxHover() {
  const c = actx(); if (!c) return
  const o = c.createOscillator(); const g = c.createGain()
  o.type = 'sine'; o.frequency.setValueAtTime(500, c.currentTime)
  o.frequency.exponentialRampToValueAtTime(700, c.currentTime + 0.1)
  g.gain.setValueAtTime(0.035, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12)
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.12)
}
function sfxPop() {
  const c = actx(); if (!c) return
  const o = c.createOscillator(); const g = c.createGain()
  o.type = 'sine'; o.frequency.setValueAtTime(800, c.currentTime)
  o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.06)
  g.gain.setValueAtTime(0.06, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12)
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.12)
}

// ── Demo Data ─────────────────────────────────────────────────────────────────
const PLANT = {
  name: 'Monstera Deliciosa',
  number: '#0847',
  rarity: 'RARE',
  hp: 87,
  personality: 'Theatrical and commanding, this soul demands center stage. Each new leaf unfurl is a performance — slow, deliberate, impossible to ignore. Harbors quiet competitive resentment toward the fiddle leaf fig across the room.',
  traits: ['Dramatic', 'Night Owl', 'Photogenic', 'Territorial'],
}

// ── Reusable glow button ──────────────────────────────────────────────────────
interface GlowButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  variant?: 'primary' | 'ghost'
  style?: React.CSSProperties
  disabled?: boolean
  type?: 'button' | 'submit'
}
function GlowButton({ children, onClick, variant = 'primary', style, disabled }: GlowButtonProps) {
  const isPrimary = variant === 'primary'
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      onHoverStart={sfxHover}
      whileHover={disabled ? {} : {
        scale: 1.04,
        boxShadow: isPrimary
          ? `0 0 28px rgba(74,222,128,0.55), 0 8px 24px rgba(0,0,0,0.4)`
          : `0 0 16px rgba(74,222,128,0.2), 0 4px 12px rgba(0,0,0,0.3)`,
      }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        fontFamily: brand.fonts.heading,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        ...(isPrimary ? {
          background: brand.colors.leaf,
          color: brand.colors.black,
          boxShadow: `0 0 16px rgba(74,222,128,0.3), 0 4px 16px rgba(0,0,0,0.35)`,
        } : {
          background: 'rgba(74,222,128,0.05)',
          color: brand.colors.textSub,
          border: `1px solid ${brand.colors.border}`,
          boxShadow: 'none',
        }),
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </motion.button>
  )
}

// ── Leaf SVG ──────────────────────────────────────────────────────────────────
function LeafSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M40 8C40 8 14 20 14 44C14 58.3 26.3 68 40 68C53.7 68 66 58.3 66 44C66 20 40 8 40 8Z"
        fill="rgba(74,222,128,0.25)" stroke="#4ade80" strokeWidth="1.5" />
      <path d="M40 68 L40 8" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M40 30 Q28 38 26 50" stroke="rgba(74,222,128,0.35)" strokeWidth="0.8" fill="none" />
      <path d="M40 38 Q52 44 54 56" stroke="rgba(74,222,128,0.35)" strokeWidth="0.8" fill="none" />
    </svg>
  )
}

// ── Confetti burst ────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#4eff8a', '#7cf5ff', '#ff8af8', '#ffe066', '#80ffb0', '#ff9f7f']

function ConfettiBurst() {
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4
    const dist = 28 + Math.random() * 20
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 3 + Math.random() * 3,
      rotate: Math.random() * 360,
    }
  })
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1.4, 0], opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.3, 1] }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: p.size, height: p.size,
            marginLeft: -p.size / 2, marginTop: -p.size / 2,
            borderRadius: p.id % 3 === 0 ? '2px' : '50%',
            background: p.color,
            pointerEvents: 'none', zIndex: 50,
          }}
        />
      ))}
    </>
  )
}

// ── Trait badge with confetti ─────────────────────────────────────────────────
function TraitBadge({ label, index }: { label: string; index: number }) {
  const [burst, setBurst] = useState(true)
  useEffect(() => {
    sfxPop()
    const t = setTimeout(() => setBurst(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <motion.span
        initial={{ scale: 0, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22, delay: index * 0.08 }}
        whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(74,222,128,0.4)' }}
        style={{
          display: 'inline-block',
          background: 'rgba(74,222,128,0.08)',
          border: `1px solid rgba(74,222,128,0.3)`,
          color: brand.colors.leaf,
          borderRadius: '999px',
          padding: '6px 16px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'default',
        }}
      >
        {label}
      </motion.span>
      <AnimatePresence>{burst && <ConfettiBurst />}</AnimatePresence>
    </div>
  )
}

// ── Upload progress bar ───────────────────────────────────────────────────────
const LEAF_MILESTONES = [20, 40, 60, 80, 100]

function UploadProgress({ phase }: { phase: 'uploading' | 'analyzing' }) {
  const targetPct = phase === 'uploading' ? 32 : 100
  const duration = phase === 'uploading' ? 0.65 : 2.6

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ width: '100%', maxWidth: 480, margin: '0 auto 40px' }}
    >
      {/* Label */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 12, marginBottom: 20,
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 22, height: 22, borderRadius: '50%',
            border: '2px solid #1a3a23',
            borderTopColor: '#4ade80',
          }}
        />
        <span style={{ color: '#a3c4ab', fontSize: 15, fontWeight: 500, letterSpacing: '0.06em' }}>
          {phase === 'uploading' ? 'UPLOADING SPECIMEN…' : 'READING SOUL SIGNATURE…'}
        </span>
      </div>

      {/* Track */}
      <div style={{
        position: 'relative',
        height: 10,
        background: '#0d1a10',
        borderRadius: 999,
        overflow: 'visible',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
      }}>
        {/* Fill */}
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${targetPct}%` }}
          transition={{ duration, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #22c55e, #4ade80)',
            boxShadow: '0 0 12px oklch(0.55 0.16 145 / 0.6)',
          }}
        />

        {/* Leaf milestones */}
        {LEAF_MILESTONES.map((pct, i) => {
          const unlockAt = phase === 'uploading' ? 0 : (pct / 100) * 2.4
          return (
            <motion.div
              key={pct}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: phase === 'uploading' ? 99 : unlockAt + 0.1, type: 'spring', stiffness: 500, damping: 20 }}
              style={{
                position: 'absolute',
                left: `${pct}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              <div style={{
                width: 22, height: 22,
                background: '#0a2e1a',
                border: '1px solid oklch(0.55 0.16 145 / 0.6)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 8px oklch(0.55 0.16 145 / 0.4)',
              }}>
                <svg width="10" height="10" viewBox="0 0 80 80" fill="none">
                  <path d="M40 8C40 8 14 20 14 44C14 58.3 26.3 68 40 68C53.7 68 66 58.3 66 44C66 20 40 8 40 8Z"
                    fill="#4ade80" />
                  <path d="M40 68L40 28" stroke="#0a2e1a" strokeWidth="6" />
                </svg>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ color: '#3d5c44', fontSize: 12, textAlign: 'center', marginTop: 14 }}>
        {phase === 'uploading' ? 'Preparing botanical scan' : 'Mapping emotional frequency & personality matrix'}
      </div>
    </motion.div>
  )
}

// ── Skeleton shimmer blocks ───────────────────────────────────────────────────
function SkeletonLoader({ phase }: { phase: 'uploading' | 'analyzing' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ textAlign: 'center' }}
    >
      <UploadProgress phase={phase} />

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="demo-shimmer" style={{ width: 240, height: 336, borderRadius: 16, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 260, maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="demo-shimmer" style={{ width: 120, height: 120, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="demo-shimmer" style={{ height: 14, borderRadius: 7, width: '60%' }} />
              <div className="demo-shimmer" style={{ height: 14, borderRadius: 7, width: '80%' }} />
            </div>
          </div>
          {[100, 88, 72, 60, 45].map((w, i) => (
            <div key={i} className="demo-shimmer" style={{ height: 12, borderRadius: 6, width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            {[80, 96, 72, 88].map((w, i) => (
              <div key={i} className="demo-shimmer" style={{ height: 28, width: w, borderRadius: 14, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Animated health ring ──────────────────────────────────────────────────────
function HealthScore({ revealed }: { revealed: boolean }) {
  const r = 52
  const circ = 2 * Math.PI * r

  const rawCount = useMotionValue(0)
  const [display, setDisplay] = useState(0)
  const pathLength = useSpring(0, { stiffness: 38, damping: 18 })

  useEffect(() => {
    if (!revealed) return
    const controls = animate(rawCount, PLANT.hp, {
      duration: 1.3,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    pathLength.set(PLANT.hp / 100)
    return controls.stop
  }, [revealed, rawCount, pathLength])

  const dashArray = useTransform(pathLength, (v) => `${v * circ} ${circ - v * circ}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="64" cy="64" r={r} fill="none" stroke="#0d1a10" strokeWidth="8" />
          <motion.circle
            cx="64" cy="64" r={r}
            fill="none"
            stroke={brand.colors.leaf}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={dashArray}
            style={{ filter: `drop-shadow(0 0 6px rgba(74,222,128,0.7))` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span
            style={{
              fontSize: 32, fontWeight: 800,
              color: '#e8f5ec',
              lineHeight: 1,
              textShadow: display > 0 ? '0 0 20px oklch(0.65 0.2 145 / 0.6)' : 'none',
            }}
          >
            {display}
          </motion.span>
          <span style={{ fontSize: 10, color: '#6b8f73', letterSpacing: '0.08em' }}>/ 100</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#6b8f73', letterSpacing: '0.1em', marginBottom: 4 }}>SOUL VITALITY</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          style={{ fontSize: 22, fontWeight: 700, color: '#e8f5ec', lineHeight: 1.2 }}
        >
          {display >= PLANT.hp ? 'Thriving' : '…'}
        </motion.div>
        <div style={{ fontSize: 12, color: '#6b8f73', marginTop: 4 }}>
          {display >= PLANT.hp ? 'Excellent spiritual health' : 'Measuring…'}
        </div>
      </div>
    </motion.div>
  )
}

// ── Typing personality ────────────────────────────────────────────────────────
function TypingText({ text, started }: { text: string; started: boolean }) {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (!started) return
    let i = 0
    const step = () => {
      setTyped(text.slice(0, i + 1))
      i++
      if (i < text.length) setTimeout(step, 18)
    }
    const t = setTimeout(step, 800)
    return () => clearTimeout(t)
  }, [started, text])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 24 }}
    >
      <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#6b8f73', marginBottom: 10, fontWeight: 600 }}>
        SOUL PERSONALITY
      </div>
      <p
        className={typed.length < text.length ? 'typing-cursor' : ''}
        style={{ color: '#a3c4ab', fontSize: 15, lineHeight: 1.7, minHeight: '6em', margin: 0 }}
      >
        {typed}
      </p>
    </motion.div>
  )
}

// ── Upload zone ───────────────────────────────────────────────────────────────
function UploadZone({
  onFile, onDemo, isDragging, onDragChange,
}: {
  onFile: (f: File) => void
  onDemo: () => void
  isDragging: boolean
  onDragChange: (v: boolean) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1, y: 0,
        borderColor: isDragging ? brand.colors.leaf : brand.colors.border,
        boxShadow: isDragging
          ? `0 0 40px rgba(74,222,128,0.25), inset 0 0 60px rgba(74,222,128,0.04)`
          : '0 0 0 transparent',
        background: isDragging ? brand.colors.forestLight : brand.colors.card,
      }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onDragOver={(e) => { e.preventDefault(); onDragChange(true) }}
      onDragLeave={() => onDragChange(false)}
      onDrop={(e) => {
        e.preventDefault(); onDragChange(false)
        const f = e.dataTransfer.files[0]; if (f) onFile(f)
      }}
      onClick={() => fileRef.current?.click()}
      style={{
        position: 'relative',
        border: '2px dashed',
        borderRadius: 24,
        padding: '64px 40px',
        textAlign: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Pulse rings */}
      {[0, 0.4, 0.8].map((delay) => (
        <div key={delay} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 80, height: 80, marginLeft: -40, marginTop: -40,
          borderRadius: '50%',
          border: '1px solid oklch(0.55 0.16 145 / 0.4)',
          animation: `pulse-ring 2.4s ease-out ${delay}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'inline-block', marginBottom: 24 }}
      >
        <LeafSVG size={72} />
      </motion.div>

      <div style={{ color: '#e8f5ec', fontSize: 20, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.01em' }}>
        {isDragging ? 'Release to reveal the soul' : 'Drop your plant photo here'}
      </div>
      <div style={{ color: '#6b8f73', fontSize: 14, marginBottom: 28 }}>
        Drag & drop or click to choose
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <GlowButton
          onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }}
          variant="primary"
          style={{ borderRadius: 999, padding: '12px 28px', fontSize: 14 }}
        >
          Choose Photo
        </GlowButton>
        <GlowButton
          onClick={(e) => { e.stopPropagation(); onDemo() }}
          variant="ghost"
          style={{ borderRadius: 999, padding: '12px 28px', fontSize: 14 }}
        >
          ✦ Try demo plant
        </GlowButton>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
    </motion.div>
  )
}

// ── Main LiveDemo ─────────────────────────────────────────────────────────────
type Phase = 'idle' | 'uploading' | 'analyzing' | 'revealed'

export function LiveDemo() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [traitsVisible, setTraitsVisible] = useState(0)

  const runAnalysis = useCallback((imgUrl?: string) => {
    if (imgUrl) setImageUrl(imgUrl)
    setTraitsVisible(0)
    setPhase('uploading')
    sfxDrop()
    setTimeout(() => { setPhase('analyzing'); sfxAnalyzing() }, 700)
    setTimeout(() => {
      setPhase('revealed')
      sfxReveal()
      PLANT.traits.forEach((_, idx) => {
        setTimeout(() => setTraitsVisible(idx + 1), 600 + idx * 200)
      })
    }, 3100)
  }, [])

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) return
    runAnalysis(URL.createObjectURL(f))
  }, [runAnalysis])

  const reset = useCallback(() => {
    setPhase('idle')
    setImageUrl(null)
    setTraitsVisible(0)
  }, [])

  return (
    <section id="demo" style={{ padding: '120px 24px', maxWidth: 900, margin: '0 auto', position: 'relative' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: 11, letterSpacing: '0.2em',
            color: brand.colors.leaf,
            background: 'rgba(74,222,128,0.06)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 999, padding: '5px 16px', fontWeight: 700,
            fontFamily: brand.fonts.sans,
            display: 'inline-block',
          }}
        >
          ◆ LIVE DEMO
        </motion.span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.08 }}
        style={{
          textAlign: 'center', fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800, color: brand.colors.text,
          marginBottom: 16, letterSpacing: '-0.04em', lineHeight: 1.1,
          fontFamily: brand.fonts.heading,
        }}
      >
        See the soul within
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.16 }}
        style={{
          textAlign: 'center', color: brand.colors.muted,
          fontSize: 18, maxWidth: 480, margin: '0 auto 60px',
          fontFamily: brand.fonts.sans,
        }}
      >
        Drop a photo. Wait 3 seconds. Watch your plant&apos;s inner world reveal itself.
      </motion.p>

      {/* Phase content */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <UploadZone
              key="idle"
              onFile={handleFile}
              onDemo={() => runAnalysis()}
              isDragging={isDragging}
              onDragChange={setIsDragging}
            />
          )}

          {(phase === 'uploading' || phase === 'analyzing') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'relative', padding: '60px 24px' }}
            >
              <SkeletonLoader phase={phase} />
            </motion.div>
          )}

          {phase === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              {/* Left: shareable card */}
              <Suspense fallback={
                <div className="demo-shimmer" style={{ width: 408, height: 700, borderRadius: 28 }} />
              }>
                <ShareCardPreview data={{
                  plantName: 'Shadow King',
                  species: PLANT.name,
                  personalityName: 'The Dramatist',
                  personalityDescription: PLANT.personality,
                  healthScore: PLANT.hp,
                  traits: PLANT.traits,
                  imageUrl: imageUrl ?? undefined,
                  cardNumber: PLANT.number,
                  rarity: PLANT.rarity,
                }} />
              </Suspense>

              {/* Right: analysis panel */}
              <div style={{ flex: 1, minWidth: 260, maxWidth: 400 }}>
                <HealthScore revealed={phase === 'revealed'} />

                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1a3a23, transparent)', marginBottom: 24 }} />

                <TypingText text={PLANT.personality} started={phase === 'revealed'} />

                {/* Traits */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#6b8f73', marginBottom: 12, fontWeight: 600 }}>
                    CORE TRAITS
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <AnimatePresence>
                      {PLANT.traits.slice(0, traitsVisible).map((trait, i) => (
                        <TraitBadge key={trait} label={trait} index={i} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <GlowButton
                    variant="primary"
                    style={{ borderRadius: 14, padding: '16px 32px', fontSize: 16, width: '100%', marginBottom: 12 }}
                  >
                    Try with your own plant →
                  </GlowButton>
                  <GlowButton
                    onClick={reset}
                    variant="ghost"
                    style={{ borderRadius: 14, padding: '10px 16px', fontSize: 13, width: '100%', border: 'none', background: 'transparent' }}
                  >
                    ↺ Analyze another plant
                  </GlowButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
