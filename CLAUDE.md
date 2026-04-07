# Brain Games App — CLAUDE.md

## Project Overview
A Progressive Web App (PWA) brain training game with 500 levels (Easy → Medium → Hard).
- **Hosting**: Netlify (primary), Play Store via Trusted Web Activity (TWA)
- **Data Policy**: No user data collected. Progress stored locally via localStorage only.
- **Tech Stack**: React 18 + Vite + TypeScript + Tailwind CSS + PWA (Workbox)

## Architecture

### Directory Structure
```
src/
  components/       # Reusable UI components
  games/            # Individual game type modules
    memory/         # Card memory matching
    sequence/       # Number/pattern sequences
    math/           # Arithmetic & algebra challenges
    wordscramble/   # Unscramble letters to form words
    pattern/        # Visual grid pattern recognition
    logic/          # Deduction / logic grid puzzles
  levels/           # Level definitions and generators
  hooks/            # Custom React hooks
  store/            # localStorage progress tracking
  utils/            # Shared helpers
public/
  icons/            # PWA icons (192x192, 512x512)
  manifest.json     # PWA manifest
```

### Level System
- **Levels 1–150**: Easy — short, forgiving, introductory
- **Levels 151–350**: Medium — longer sequences, harder math, more cards
- **Levels 351–500**: Hard — complex patterns, time pressure, multi-step logic
- Levels are procedurally generated from seed configs so they are reproducible
- Each level has: `id`, `type`, `difficulty`, `config`, `starThresholds`

### Game Types
1. **Memory Match** — flip card pairs, grows grid size with difficulty
2. **Number Sequence** — complete the pattern (arithmetic, geometric, Fibonacci)
3. **Speed Math** — solve equations before timer expires
4. **Word Scramble** — unscramble a word, hint available (costs a star)
5. **Visual Pattern** — pick the next item in a visual grid
6. **Logic Deduction** — simple constraint-satisfaction (who owns the cat?)

### Progress Tracking (localStorage)
```ts
interface Progress {
  completedLevels: Record<number, { stars: number; attempts: number }>;
  unlockedLevel: number;   // highest unlocked
  totalStars: number;
}
```
Key: `braingames_progress` — no server, no account required.

## Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Deploy
- **Netlify**: auto-deploy from `main` branch. Build command: `npm run build`, publish dir: `dist`
- **Play Store**: Use Bubblewrap CLI to generate TWA from the deployed Netlify URL

## GitHub
- Remote: configured by user
- Branch strategy: `main` (production), `dev` (active development)
- CI: GitHub Actions → Netlify deploy preview on PR

## Code Style
- TypeScript strict mode
- Functional components only, no class components
- Tailwind for all styling — no CSS modules or styled-components
- No external state libraries — React context + hooks only
- Game logic must be pure functions (testable without React)

## Skills Needed
- React + Vite PWA setup
- Tailwind CSS
- localStorage persistence
- Procedural level generation
- GitHub Actions CI/CD
- Netlify deploy config
- TWA (Trusted Web Activity) for Play Store packaging

## Constraints
- Bundle size target: < 500KB gzipped
- No analytics, no tracking pixels, no external API calls
- Must work offline (service worker caches all assets)
- Accessible: keyboard navigable, sufficient color contrast
