import { LiveDemo } from './components/live-demo'
import { HowItWorks } from './components/how-it-works'
import { Logo } from './components/logo'
import { brand } from './lib/brand'

// ── Ambient particles ─────────────────────────────────────────────────────────
function Particles() {
  const seeds = [
    { x: 12, y: 20, delay: 0,   dur: 8,  size: 3 },
    { x: 85, y: 60, delay: 1.2, dur: 11, size: 2 },
    { x: 35, y: 78, delay: 2.4, dur: 9,  size: 4 },
    { x: 68, y: 15, delay: 0.6, dur: 12, size: 2 },
    { x: 22, y: 55, delay: 3.1, dur: 7,  size: 3 },
    { x: 90, y: 35, delay: 1.8, dur: 10, size: 2 },
    { x: 50, y: 88, delay: 4.0, dur: 8,  size: 3 },
    { x: 75, y: 70, delay: 2.0, dur: 13, size: 2 },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {seeds.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: brand.colors.leaf,
            opacity: 0.3,
            animation: `particle-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 3}px ${brand.colors.leaf}`,
          }}
        />
      ))}
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      padding: '28px 40px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 10,
    }}>
      <Logo size={32} variant="lockup" pulse />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a
          href="#how"
          style={{
            fontSize: 13, color: brand.colors.muted,
            textDecoration: 'none', letterSpacing: '0.02em',
            fontFamily: brand.fonts.sans,
            transition: 'color 0.2s',
          }}
        >
          How it works
        </a>
        <a
          href="#demo"
          style={{
            background: brand.colors.leaf,
            color: brand.colors.black,
            border: 'none',
            borderRadius: 999,
            padding: '9px 22px',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.02em',
            fontFamily: brand.fonts.sans,
            boxShadow: `0 0 16px rgba(74,222,128,0.3)`,
            transition: 'all 0.2s',
          }}
        >
          Try free
        </a>
      </div>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', textAlign: 'center',
        padding: '40px 24px',
        background: `
          radial-gradient(ellipse 80% 55% at 50% -5%, ${brand.colors.forest} 0%, transparent 65%),
          radial-gradient(ellipse 50% 35% at 15% 100%, rgba(10,46,26,0.5) 0%, transparent 60%),
          ${brand.colors.black}
        `,
        overflow: 'hidden',
      }}
    >
      <Particles />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)',
      }} />

      <Nav />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 780 }}>
        {/* Badge */}
        <div style={{
          marginBottom: 36, display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(74,222,128,0.06)',
          border: `1px solid rgba(74,222,128,0.2)`,
          borderRadius: 999, padding: '6px 18px 6px 10px',
        }}>
          <span style={{
            background: brand.colors.leaf, borderRadius: 999,
            padding: '3px 10px', fontSize: 10, fontWeight: 800,
            color: brand.colors.black, letterSpacing: '0.12em',
            fontFamily: brand.fonts.heading,
          }}>
            NEW
          </span>
          <span style={{ fontSize: 12, color: brand.colors.muted, letterSpacing: '0.04em', fontFamily: brand.fonts.sans }}>
            AI-powered botanical soul analysis
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: 'clamp(52px, 9vw, 104px)',
            fontWeight: 800, lineHeight: 0.95,
            letterSpacing: '-0.045em',
            color: brand.colors.text,
            marginBottom: 0,
            animation: 'hero-reveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          Plants
        </h1>
        <h1
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: 'clamp(52px, 9vw, 104px)',
            fontWeight: 800, lineHeight: 0.95,
            letterSpacing: '-0.045em',
            marginBottom: 0,
            animation: 'hero-reveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
            background: `linear-gradient(135deg, ${brand.colors.leaf}, ${brand.colors.leafDim})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Have Souls.
        </h1>
        <h1
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: 'clamp(52px, 9vw, 104px)',
            fontWeight: 800, lineHeight: 0.95,
            letterSpacing: '-0.045em',
            color: brand.colors.text,
            marginBottom: 44,
            animation: 'hero-reveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
          }}
        >
          Now You Know.
        </h1>

        <p style={{
          fontFamily: brand.fonts.sans,
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: brand.colors.muted,
          lineHeight: 1.7, marginBottom: 52,
          maxWidth: 520, margin: '0 auto 52px',
          animation: 'fade-up 0.8s ease 0.45s both',
        }}>
          Upload a photo of any plant. In seconds, discover its personality,
          emotional state, and the hidden story it&apos;s been trying to tell you.
        </p>

        <div style={{
          display: 'flex', gap: 16, justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fade-up 0.8s ease 0.6s both',
        }}>
          <a
            href="#demo"
            style={{
              fontFamily: brand.fonts.heading,
              background: brand.colors.leaf,
              color: brand.colors.black,
              textDecoration: 'none',
              borderRadius: 14, padding: '18px 36px',
              fontSize: 16, fontWeight: 700,
              letterSpacing: '-0.02em',
              boxShadow: `0 0 32px rgba(74,222,128,0.4), 0 8px 24px rgba(0,0,0,0.4)`,
              transition: 'all 0.2s ease',
              display: 'inline-block',
            }}
          >
            Read your plant&apos;s soul →
          </a>
          <a
            href="#how"
            style={{
              fontFamily: brand.fonts.sans,
              background: 'rgba(74,222,128,0.05)',
              color: brand.colors.textSub,
              textDecoration: 'none',
              borderRadius: 14, padding: '18px 32px',
              fontSize: 16, fontWeight: 500,
              border: `1px solid ${brand.colors.border}`,
              display: 'inline-block',
            }}
          >
            How it works
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'fade-up 0.8s ease 1.1s both',
      }}>
        <span style={{ fontSize: 9, color: brand.colors.dim, letterSpacing: '0.2em', fontFamily: brand.fonts.sans }}>
          SCROLL
        </span>
        <div style={{
          width: 1, height: 36,
          background: `linear-gradient(to bottom, ${brand.colors.leafFaint}, transparent)`,
          animation: 'float-leaf 2s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main style={{ overflowX: 'hidden', background: brand.colors.black }}>
      <Hero />

      {/* How It Works */}
      <div id="how">
        <HowItWorks />
      </div>

      {/* Live Demo */}
      <div
        style={{
          background: brand.colors.black,
          borderTop: `1px solid ${brand.colors.border}`,
        }}
      >
        <LiveDemo />
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${brand.colors.border}`,
        padding: '48px 24px',
        textAlign: 'center',
        background: brand.colors.black,
      }}>
        <Logo size={28} variant="lockup-sm" style={{ marginBottom: 16, display: 'inline-flex' }} />
        <p style={{ fontSize: 13, color: brand.colors.dim, fontFamily: brand.fonts.sans, margin: 0 }}>
          Every plant has a story. Now you can hear it.
        </p>
      </footer>
    </main>
  )
}
