'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import * as htmlToImage from 'html-to-image'

export interface PlantCardData {
  plantName: string
  species: string
  personalityName: string
  personalityDescription: string
  healthScore: number
  traits: string[]
  imageUrl?: string
  cardNumber?: string
  rarity?: string
}

const DEMO_DATA: PlantCardData = {
  plantName: 'Shadow King',
  species: 'Monstera Deliciosa',
  personalityName: 'The Dramatist',
  personalityDescription:
    'Theatrical and commanding, this soul demands center stage. Each new leaf unfurl is a performance — slow, deliberate, impossible to ignore.',
  healthScore: 87,
  traits: ['Dramatic', 'Night Owl', 'Photogenic', 'Territorial'],
  cardNumber: '#0847',
  rarity: 'RARE',
}

// ── Leaf placeholder ──────────────────────────────────────────────────────────

function LeafPlaceholder() {
  return (
    <svg width="110" height="110" viewBox="0 0 80 80" fill="none" opacity="0.5">
      <path
        d="M40 8C40 8 14 20 14 44C14 58.3 26.3 68 40 68C53.7 68 66 58.3 66 44C66 20 40 8 40 8Z"
        fill="rgba(80,200,100,0.2)"
        stroke="rgba(100,220,120,0.6)"
        strokeWidth="1.5"
      />
      <path d="M40 68 L40 12" stroke="rgba(100,220,120,0.4)" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M40 32 Q28 40 26 52" stroke="rgba(80,200,100,0.3)" strokeWidth="0.8" fill="none" />
      <path d="M40 40 Q52 46 54 58" stroke="rgba(80,200,100,0.3)" strokeWidth="0.8" fill="none" />
    </svg>
  )
}

// ── Health ring ───────────────────────────────────────────────────────────────

function HealthRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size / 2 - 6
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          style={{
            stroke: 'url(#ringGrad)',
            filter: 'drop-shadow(0 0 4px rgba(120,255,150,0.7))',
          }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4eff8a" />
            <stop offset="50%" stopColor="#a0ffb8" />
            <stop offset="100%" stopColor="#4eff8a" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: `${size * 0.27}px`, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: `${size * 0.1}px`, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>/ 100</span>
      </div>
    </div>
  )
}

// ── Holographic card ──────────────────────────────────────────────────────────

export function PlantShareCard({
  data,
  cardRef,
  mouse,
}: {
  data: PlantCardData
  cardRef: React.RefObject<HTMLDivElement | null>
  mouse?: { x: number; y: number; active: boolean }
}) {
  const mx = mouse?.x ?? 0.5
  const my = mouse?.y ?? 0.5
  const active = mouse?.active ?? false

  // Holo gradient shifts with mouse
  const holoAngle = active ? `${mx * 360}deg` : '120deg'
  const holoX = mx * 100
  const holoY = my * 100

  // Rainbow spectrum stops for the foil layer
  const spectrumStops = [
    'rgba(255,80,80,0.22)',
    'rgba(255,160,60,0.18)',
    'rgba(255,240,80,0.15)',
    'rgba(80,255,120,0.22)',
    'rgba(60,180,255,0.18)',
    'rgba(160,80,255,0.15)',
    'rgba(255,80,200,0.18)',
    'rgba(255,80,80,0.12)',
  ].join(', ')

  return (
    <div
      ref={cardRef}
      style={{
        width: '400px',
        height: '600px',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        // Base card gradient — deep botanical
        background: `
          radial-gradient(ellipse 90% 60% at 30% 0%,  #162e18 0%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 80% 100%, #0e2416 0%, transparent 50%),
          linear-gradient(160deg, #0f1e11 0%, #080e09 55%, #060c07 100%)
        `,
        flexShrink: 0,
        isolation: 'isolate',
      }}
    >
      {/* ── Foil / holographic layer (mouse-reactive) ── */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none',
          borderRadius: '20px',
          // Prismatic conic gradient that rotates with mouse x
          background: `
            conic-gradient(from ${holoAngle} at ${holoX}% ${holoY}%, ${spectrumStops}),
            radial-gradient(circle at ${holoX}% ${holoY}%, rgba(180,255,200,0.12) 0%, transparent 50%)
          `,
          mixBlendMode: 'color-dodge',
          opacity: active ? 0.75 : 0.2,
          transition: active ? 'opacity 0.15s ease' : 'opacity 0.6s ease',
        }}
      />

      {/* ── Green shimmer sweep (always-on) ── */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none', borderRadius: '20px',
          background: `
            linear-gradient(
              ${105 + (active ? mx * 30 - 15 : 0)}deg,
              transparent 0%,
              rgba(100,255,140,0.06) 35%,
              rgba(150,255,180,0.1) 50%,
              rgba(100,255,140,0.06) 65%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          transition: 'background 0.1s ease',
        }}
      />

      {/* ── Ambient glow blobs ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 60% 40% at 20% 15%, rgba(60,180,90,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 50% 35% at 85% 80%, rgba(40,140,80,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 60% 45%, rgba(80,200,110,0.06) 0%, transparent 60%)
        `,
      }} />

      {/* ── Inset border glow ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', borderRadius: '20px',
        boxShadow: `
          inset 0 0 0 1px rgba(100,220,130,0.35),
          inset 0 0 0 2px rgba(60,160,90,0.15),
          inset 0 1px 0 rgba(180,255,200,0.25),
          inset 0 -1px 0 rgba(40,120,60,0.2)
        `,
      }} />

      {/* ── Photo zone ── */}
      <div style={{ position: 'relative', height: '230px', width: '100%', zIndex: 2 }}>
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.plantName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            crossOrigin="anonymous"
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(160deg, #132018, #0b180e)',
          }}>
            <LeafPlaceholder />
          </div>
        )}

        {/* Scan lines (like a holographic card) */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
          mixBlendMode: 'multiply',
        }} />

        {/* Gradient fade into body */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '130px', pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(8,14,9,0.7) 60%, #080e09 100%)',
        }} />

        {/* Card number + rarity — top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)',
        }}>
          <span style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.45)',
            fontFamily: 'monospace', letterSpacing: '0.12em',
          }}>
            {data.cardNumber ?? '#0001'}
          </span>
          {/* Rarity pill with glow */}
          <span style={{
            fontSize: '9px', fontWeight: 800, letterSpacing: '0.18em',
            color: '#7cffa0',
            background: 'rgba(50,180,80,0.15)',
            border: '1px solid rgba(80,220,110,0.4)',
            borderRadius: '6px',
            padding: '3px 10px',
            textShadow: '0 0 8px rgba(100,255,140,0.8)',
            boxShadow: '0 0 12px rgba(80,200,110,0.25)',
          }}>
            ◆ {data.rarity ?? 'COMMON'}
          </span>
        </div>

        {/* Health ring — straddling photo/body seam */}
        <div style={{
          position: 'absolute', bottom: '-38px', right: '22px', zIndex: 15,
          background: 'linear-gradient(145deg, #132018, #080e09)',
          borderRadius: '50%',
          padding: '5px',
          boxShadow: `
            0 0 0 1px rgba(80,200,110,0.3),
            0 0 20px rgba(60,180,90,0.35),
            0 6px 20px rgba(0,0,0,0.7)
          `,
        }}>
          <HealthRing score={data.healthScore} size={80} />
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '16px 22px 18px', position: 'relative', zIndex: 3 }}>
        {/* Vitality label — right-aligned above ring */}
        <div style={{ textAlign: 'right', marginBottom: '6px' }}>
          <span style={{
            fontSize: '8px', letterSpacing: '0.2em', fontWeight: 700,
            color: 'rgba(100,220,130,0.6)',
            textTransform: 'uppercase',
          }}>
            Soul Vitality
          </span>
        </div>

        {/* Archetype label */}
        <div style={{
          fontSize: '10px', letterSpacing: '0.2em', fontWeight: 700,
          color: 'rgba(100,220,130,0.55)',
          marginBottom: '3px',
          textTransform: 'uppercase',
        }}>
          Soul Archetype
        </div>

        {/* Personality name — big, glowing */}
        <div style={{
          fontSize: '30px', fontWeight: 900, lineHeight: 1.0,
          letterSpacing: '-0.03em',
          marginBottom: '10px',
          // Subtle text glow
          color: '#fff',
          textShadow: '0 0 30px rgba(100,255,140,0.25), 0 0 60px rgba(80,200,110,0.1)',
        }}>
          {data.personalityName}
        </div>

        {/* Divider with glow */}
        <div style={{
          height: '1px', marginBottom: '10px',
          background: 'linear-gradient(90deg, rgba(80,200,110,0.5), rgba(60,160,90,0.2) 60%, transparent)',
          boxShadow: '0 0 6px rgba(80,200,110,0.3)',
        }} />

        {/* Description */}
        <p style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.48)',
          fontStyle: 'italic', lineHeight: 1.6,
          margin: '0 0 12px 0',
        }}>
          {data.personalityDescription}
        </p>

        {/* Traits */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {data.traits.map((t) => (
            <span key={t} style={{
              fontSize: '10px', fontWeight: 700,
              color: '#6bdb8f',
              background: 'rgba(60,180,90,0.1)',
              border: '1px solid rgba(80,200,110,0.3)',
              borderRadius: '999px',
              padding: '3px 10px',
              letterSpacing: '0.04em',
              textShadow: '0 0 8px rgba(80,200,110,0.4)',
              boxShadow: '0 0 6px rgba(60,180,90,0.15)',
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Plant identity row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          marginBottom: '16px',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
            background: 'rgba(60,180,90,0.12)',
            border: '1px solid rgba(80,200,110,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 10px rgba(60,180,90,0.2)',
          }}>
            <svg width="14" height="14" viewBox="0 0 80 80" fill="none">
              <path d="M40 8C40 8 14 20 14 44C14 58.3 26.3 68 40 68C53.7 68 66 58.3 66 44C66 20 40 8 40 8Z" fill="#5de87a" />
              <path d="M40 68 L40 24" stroke="#0d1f0f" strokeWidth="3" />
            </svg>
          </div>
          <div>
            <div style={{
              fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.2,
              textShadow: '0 0 12px rgba(100,255,140,0.15)',
            }}>
              {data.plantName}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.32)', fontStyle: 'italic' }}>
              {data.species}
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
          <div style={{
            width: '14px', height: '14px', borderRadius: '4px',
            background: 'rgba(60,180,90,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 6px rgba(80,200,110,0.4)',
          }}>
            <svg width="7" height="7" viewBox="0 0 80 80" fill="none">
              <path d="M40 8C40 8 14 20 14 44C14 58.3 26.3 68 40 68C53.7 68 66 58.3 66 44C66 20 40 8 40 8Z" fill="white" />
              <path d="M40 68 L40 24" stroke="#0d1f0f" strokeWidth="6" />
            </svg>
          </div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
            Analyzed by{' '}
            <strong style={{ color: 'rgba(100,220,130,0.4)', fontWeight: 600 }}>PlantSoul</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Interactive wrapper with mouse tracking ───────────────────────────────────

export function ShareCardPreview({ data = DEMO_DATA }: { data?: PlantCardData }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5, active: false })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMouse({ x, y, active: true })
    setTilt({ x: (y - 0.5) * -18, y: (x - 0.5) * 20 })
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouse((m) => ({ ...m, active: false }))
    setTilt({ x: 0, y: 0 })
  }, [])

  // Idle shimmer auto-animation when not hovered
  useEffect(() => {
    let frame: number
    let t = 0
    const tick = () => {
      t += 0.008
      if (!mouse.active) {
        setMouse({ x: 0.5 + Math.sin(t) * 0.3, y: 0.5 + Math.cos(t * 0.7) * 0.2, active: false })
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [mouse.active])

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
      })
      const link = document.createElement('a')
      link.download = `plantsoul-${data.plantName.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Card download failed', err)
    } finally {
      setDownloading(false)
    }
  }, [data.plantName])

  const handleCopy = useCallback(async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, skipFonts: true })
      const blob = await (await fetch(dataUrl)).blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      {/* Card scene */}
      <div
        ref={wrapRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'relative',
          cursor: 'pointer',
          // Outer glow rings
          filter: mouse.active
            ? 'drop-shadow(0 0 24px rgba(80,200,110,0.35)) drop-shadow(0 0 60px rgba(60,160,90,0.2))'
            : 'drop-shadow(0 0 12px rgba(60,160,90,0.2)) drop-shadow(0 0 32px rgba(40,120,70,0.12))',
          transition: 'filter 0.3s ease',
        }}
      >
        {/* Gradient border shell */}
        <div style={{
          borderRadius: '24px',
          padding: '2px',
          background: mouse.active
            ? `conic-gradient(from ${mouse.x * 360}deg, #3db86a, #7dffaa, #3db86a, #2a8a50, #5cdf84, #3db86a)`
            : 'linear-gradient(145deg, rgba(80,200,110,0.5), rgba(40,140,70,0.2) 40%, rgba(60,180,90,0.4))',
          boxShadow: mouse.active
            ? '0 0 0 1px rgba(80,200,110,0.15), 0 24px 60px rgba(0,0,0,0.7), 0 0 80px rgba(60,180,90,0.12)'
            : '0 0 0 1px rgba(60,160,90,0.1), 0 24px 60px rgba(0,0,0,0.7)',
          animation: mouse.active ? 'none' : 'card-float 4s ease-in-out infinite',
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 && tilt.y === 0
            ? 'transform 0.7s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.3s ease, background 0.3s ease'
            : 'transform 0.08s ease, box-shadow 0.15s ease, background 0.15s ease',
        }}>
          <PlantShareCard data={data} cardRef={cardRef} mouse={mouse} />
        </div>

        {/* Reflection ghost below card */}
        <div style={{
          position: 'absolute', bottom: '-40px', left: '10%', right: '10%', height: '40px',
          background: 'radial-gradient(ellipse at center, rgba(60,180,90,0.15), transparent 70%)',
          filter: 'blur(6px)',
          pointerEvents: 'none',
          opacity: mouse.active ? 0.8 : 0.4,
          transition: 'opacity 0.3s ease',
        }} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #2e8b50, #3db868)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 26px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: downloading ? 'not-allowed' : 'pointer',
            opacity: downloading ? 0.7 : 1,
            letterSpacing: '-0.01em',
            boxShadow: '0 0 20px rgba(50,180,90,0.4), 0 4px 16px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
          onMouseOver={(e) => {
            if (downloading) return
            const el = e.currentTarget
            el.style.transform = 'translateY(-2px)'
            el.style.boxShadow = '0 0 30px rgba(60,200,100,0.55), 0 8px 24px rgba(0,0,0,0.4)'
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget
            el.style.transform = 'none'
            el.style.boxShadow = '0 0 20px rgba(50,180,90,0.4), 0 4px 16px rgba(0,0,0,0.4)'
          }}
        >
          {/* Button shimmer */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
          }} />
          <DownloadIcon />
          {downloading ? 'Rendering…' : 'Download Card'}
        </button>

        <button
          onClick={handleCopy}
          style={{
            background: 'rgba(50,180,90,0.08)',
            color: '#6bdb8f',
            border: '1px solid rgba(80,200,110,0.3)',
            borderRadius: '12px',
            padding: '12px 22px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 0 12px rgba(50,180,90,0.1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(100,220,130,0.6)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(60,200,100,0.2)'
            e.currentTarget.style.background = 'rgba(50,180,90,0.14)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(80,200,110,0.3)'
            e.currentTarget.style.boxShadow = '0 0 12px rgba(50,180,90,0.1)'
            e.currentTarget.style.background = 'rgba(50,180,90,0.08)'
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy Image'}
        </button>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(100,180,120,0.35)', textAlign: 'center', letterSpacing: '0.04em' }}>
        2× resolution PNG · share-ready
      </p>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
