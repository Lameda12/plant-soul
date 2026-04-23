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

## 🏗 Architecture Notes

- **Tailwind v4** — All design tokens live in `globals.css` `@theme inline`. The `tailwind.config.ts` is a plugin extension point only.
- **Framer Motion** — Phase transitions (`AnimatePresence`), spring counters (`useMotionValue` + `animate()`), scroll reveals (`useInView`), confetti bursts.
- **Web Audio API** — All SFX synthesized at runtime. Zero audio files shipped.
- **html-to-image** — `skipFonts: true` required to avoid a crash on variable `@font-face` descriptors.

## 📜 License

MIT
