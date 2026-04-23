# 🌿 PlantSoul

> **Plants Have Souls. Now You Know.**

PlantSoul is an AI-powered botanical analysis app that discovers the personality, emotional state, and hidden story inside any plant — from a single photo.

[![Deploy](https://img.shields.io/badge/Live-plant--soul.vercel.app-4ade80?style=flat-square&logo=vercel&logoColor=black)](https://plant-soul.vercel.app) ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)

---

## ✨ Features

- **Instant Soul Analysis** — Upload any plant photo and receive a full personality profile in under 5 seconds
- **Holographic Trading Card** — Each analysis generates a downloadable 2× resolution holographic card with mouse-tracked foil effect
- **Interactive Live Demo** — Drag-and-drop upload zone with animated progress bar, leaf milestones, skeleton loader, and staggered result reveal
- **Sound Design** — Synthesized Web Audio API effects throughout (no library required): drop thud, analyzing hum, reveal arpeggio, badge pop, hover chirp
- **Badge Confetti** — Trait badges spring in with particle burst animations
- **Shareable Cards** — Copy to clipboard or download as 2× PNG, ready for social media

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--ps-black` | `#050505` | Page background |
| `--ps-forest` | `#0a2e1a` | Primary / hero gradient |
| `--ps-leaf` | `#4ade80` | Accent, CTAs, glows |
| `--ps-card` | `#0d1a10` | Card surfaces |
| `--ps-text` | `#e8f5ec` | Body text |
| `--ps-muted` | `#6b8f73` | Secondary text |

**Fonts:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (headings) · [Inter](https://fonts.google.com/specimen/Inter) (body)

All tokens are available as Tailwind utilities (`bg-ps-leaf`, `text-ps-forest`, etc.) and as JS constants in `app/lib/brand.ts`.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme`) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| UI Primitives | [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) |
| Database | [Supabase](https://supabase.com) |
| AI | [OpenAI SDK](https://github.com/openai/openai-node) |
| Image Export | [html-to-image](https://github.com/bubkoo/html-to-image) |
| Language | TypeScript 5 |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project
- An OpenAI API key

### Installation

```bash
git clone https://github.com/Lameda12/plant-soul.git
cd plant-soul
npm install
```

### Environment Variables

Create a `.env.local` at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
plant-soul/
├── app/
│   ├── api/                   # API routes (plant analysis)
│   ├── components/
│   │   ├── logo.tsx           # Brand logo — LogoMark + Logo lockup variants
│   │   ├── live-demo.tsx      # Interactive upload → analysis flow
│   │   ├── share-card.tsx     # Holographic trading card + download/copy
│   │   └── how-it-works.tsx   # Scroll-triggered 4-step timeline
│   ├── lib/
│   │   └── brand.ts           # Design token constants (colors, fonts, shadows)
│   ├── globals.css            # Tailwind v4 @theme + brand CSS custom properties
│   ├── layout.tsx             # Font loading (Inter, Space Grotesk, Geist Mono)
│   └── page.tsx               # Landing page (Hero + How It Works + Demo)
├── lib/
│   ├── plant-personality.ts   # AI personality generation helpers
│   └── rate-limit.ts          # API rate limiting
├── supabase/                  # DB migrations + types
└── tailwind.config.ts         # Plugin extension point (tokens live in CSS)
```

## 🎬 Demo Walkthrough

| Step | What happens |
|------|-------------|
| **Upload** | Drag & drop or click — border glows, three pulse rings expand, leaf icon floats |
| **Progress** | Bar fills 0→100% with leaf icon milestones at each 20% mark |
| **Skeleton** | Shimmer cards mirror the result layout |
| **Reveal** | Ascending arpeggio plays; health ring fills via spring physics; personality types out; trait badges spring in with confetti bursts |
| **Card** | Holographic foil tracks mouse via conic gradient; 3D tilt on `perspective(1000px)` |
| **Download** | 2× PNG via `html-to-image` with `skipFonts: true` |

---

## 🎥 1-Minute Demo Script

> A complete scene-by-scene shooting script for a 60-second product demo video.
> Suitable for social media, landing page hero, or App Store preview.

---

### Scene 1 — The Discovery (0:00 – 0:08)

**Shot:** Close-up of a drooping, yellowed pothos on a windowsill. Natural side lighting. Slightly sad music.

**Action:** A hand reaches into frame and picks up the phone sitting next to it.

**Screen:** Phone wakes. Safari (or Chrome) opens. User types `plant-soul.vercel.app`. The hero headline — **"Plants Have Souls. Now You Know."** — fades in with the staggered letter-spacing animation.

**Narration / caption:** *"My plant has been looking rough for weeks. I had no idea what was wrong."*

---

### Scene 2 — The Upload (0:08 – 0:18)

**Shot:** Over-the-shoulder view of the phone screen. The user scrolls to the Live Demo section.

**Action:**
1. User taps **"Choose Photo"** — the button scales up with the spring glow on press.
2. Camera roll opens. User selects the sad pothos photo.
3. The upload zone border lights up green. A **soft thud + rising tone** plays (Web Audio).

**Screen:** The dashed upload border glows bright `#4ade80`. Three pulse rings expand outward. The leaf icon floats up.

**Caption:** *"I dropped a photo and let it do its thing."*

---

### Scene 3 — The Analysis (0:18 – 0:30)

**Shot:** Full phone screen, recorded at 60fps for smooth playback.

**Action:** The progress bar fills left-to-right. Leaf icons appear at each 20% milestone with a pop sound. A low hum builds in pitch.

**Screen:**
- **0:18** — Progress bar at 0%. Status: `UPLOADING SPECIMEN…`
- **0:22** — Bar at 32%. Status changes to `READING SOUL SIGNATURE…`
- **0:26** — Bar fills to 100%. Final leaf milestone springs in.
- **0:28** — Skeleton shimmer cards flash briefly — then dissolve.

**Narration / caption:** *"Three seconds. That's all it takes."*

---

### Scene 4 — The Reveal (0:30 – 0:46)

**Shot:** Phone held in portrait. Results slide up into frame.

**Action:** Results appear in staggered sequence — each beat timed to the ascending arpeggio chord:

| Timestamp | What appears on screen |
|-----------|----------------------|
| 0:30 | Health ring arc draws from 0 → **42** — pulsing amber glow |
| 0:33 | Label below ring: **"Struggling"** fades in |
| 0:35 | Personality text begins typing: *"Theatrical and demanding, this soul..."* — cursor blinks |
| 0:40 | Four trait badges spring in one by one: **Dramatic · Thirsty · Sunseeker · Resilient** — confetti bursts on each |
| 0:43 | Holographic trading card floats into frame on the left — foil shimmer catches light as the user tilts the phone |

**Caption:** *"Score: 42. Struggling. But not giving up."*

---

### Scene 5 — The Share (0:46 – 0:50)

**Shot:** User's thumb taps **"Download Card"**. Button glows green and scales.

**Screen:** Card saves to camera roll. A toast / confirmation animation plays.

**Cut to:** The holographic card displayed in Photos app — full resolution, foil shimmer visible.

**Caption:** *"Saved. Shared. Posted."*

---

### Scene 6 — Seven Days Later (0:50 – 1:00)

**Shot:** Same windowsill. The pothos is visibly fuller, greener, one new leaf unfurling. Golden hour light.

**Action:** Phone appears again. User opens PlantSoul and uploads a new photo of the same plant.

**Screen:** Results reveal — health ring climbs to **79**. Label: **"Content"**. Personality text types: *"A dramatic recovery arc — this plant has turned its trauma into growth. Literally."*

**Badge unlocks:** ✨ **COMEBACK KID** — confetti burst fills the screen.

**Final frame:** Logo lockup centered on dark background. `plant-soul.vercel.app` below it. Leaf icon pulses with the soul glow.

**Caption / VO:** *"Your plant has a soul. Now you know."*

---

### 🎙 Recording Tips

#### Equipment
- **Phone:** iPhone 14+ or Pixel 7+ for 4K 60fps. Enable **Action Mode** (iPhone) or **Stable** mode for handheld shots.
- **Screen recording:** Use iOS built-in screen recorder (Control Centre) or [Rottenwood](https://apps.apple.com/app/rottenwood/id1561180637) for phone-frame overlays.
- **Lighting:** Shoot near a north-facing window. Avoid overhead fluorescents — they flatten the phone screen.

#### Transitions
- **Cut on motion** — start cutting as the thumb lifts off the button, not before. Creates natural momentum.
- **Match cut** on the progress bar: cut from 0% to 100% with a single frame of the full bar, then cut to results. Feels instant without lying.
- **J-cut into Scene 6** — let the ambient music from the healthy-plant shot bleed under the final second of Scene 5.
- Avoid wipes and star-wipes. Hard cuts and dissolves only.

#### Screen visibility
- Set phone brightness to **100%** before recording.
- Enable **Reduce Transparency** and **Increase Contrast** in Accessibility settings to make UI elements pop on camera.
- Record at **2× zoom minimum** when capturing screen + hands together — phone screens lose detail below that.
- Use a **phone stand or gorilla pod** for the full-screen shots (Scenes 3 and 4) — even 2px of shake reads as jitter on a 4K timeline.

#### Audio
| Segment | Music suggestion |
|---------|-----------------|
| Scene 1 (sad plant) | Ambient, minor key, 60–70 BPM. [Lofi Girl - Sleepy Fish](https://www.youtube.com/watch?v=5qap5aO4i9A) style. |
| Scenes 2–4 (analysis) | Beat drops subtly at the upload. Energy builds with the progress bar. |
| Scene 4 reveal | The in-app arpeggio SFX syncs naturally — let it breathe, duck music under it. |
| Scene 6 (comeback) | Lift to a brighter, warmer key. Same tempo, new mood. |

Keep music at **−18 dB** under any narration. The in-app sound effects are mixed to sit at conversational volume — don't suppress them.

#### Editing checklist
- [ ] Export at **1080p 60fps** minimum (4K preferred for Reels/TikTok sharpness)
- [ ] Add **closed captions** — 85% of social video is watched muted
- [ ] Include the live URL as a lower-third in the final 5 seconds
- [ ] First frame should hook within 0.5s — start on the sad plant, not the logo
- [ ] Total runtime: 58–62 seconds (Reels / TikTok optimal length)

---

## 🏗 Architecture Notes

- **Tailwind v4** — All design tokens live in `globals.css` `@theme inline`. The `tailwind.config.ts` is a plugin extension point only.
- **Framer Motion** — Phase transitions (`AnimatePresence`), spring counters (`useMotionValue` + `animate()`), scroll reveals (`useInView`), confetti bursts.
- **Web Audio API** — All SFX synthesized at runtime. Zero audio files shipped.
- **html-to-image** — `skipFonts: true` required to avoid a crash on variable `@font-face` descriptors.

## 📜 License

MIT
