import type { Progress } from '@/store/progress'

interface Props {
  progress: Progress
  onPlay: () => void
  onMap: () => void
  onReset: () => void
}

export function HomeScreen({ progress, onPlay, onMap, onReset }: Props) {
  const completed = Object.keys(progress.completedLevels).length
  const pct = Math.round((completed / 500) * 100)
  const nextLevel = progress.unlockedLevel

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6 min-h-screen text-center">
      {/* Logo */}
      <div className="relative">
        <div className="absolute inset-0 blur-3xl bg-brand-purple/30 rounded-full" />
        <h1 className="font-display text-6xl font-black text-gradient relative">
          BRAIN<br />GAMES
        </h1>
        <p className="text-white/50 mt-2 text-sm">500 Levels · Train Your Mind</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        <div className="card-glass p-3 text-center">
          <div className="font-display font-bold text-2xl text-brand-cyan">{completed}</div>
          <div className="text-white/50 text-xs">Completed</div>
        </div>
        <div className="card-glass p-3 text-center">
          <div className="font-display font-bold text-2xl text-brand-gold">{progress.totalStars}</div>
          <div className="text-white/50 text-xs">Stars</div>
        </div>
        <div className="card-glass p-3 text-center">
          <div className="font-display font-bold text-2xl text-brand-violet">{pct}%</div>
          <div className="text-white/50 text-xs">Complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>Level {nextLevel}</span>
          <span>500</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan transition-all duration-700"
            style={{ width: `${Math.max(pct, 1)}%` }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button className="btn-primary text-lg py-4 animate-glow" onClick={onPlay}>
          ▶ Continue — Level {nextLevel}
        </button>
        <button className="btn-ghost" onClick={onMap}>
          🗺 Level Map
        </button>
      </div>

      {/* Difficulty legend */}
      <div className="flex gap-4 text-xs text-white/40">
        <span className="text-green-400">● Easy 1–150</span>
        <span className="text-blue-400">● Medium 151–350</span>
        <span className="text-red-400">● Hard 351–500</span>
      </div>

      <button onClick={onReset} className="text-white/20 text-xs hover:text-white/40 transition-colors mt-4">
        Reset Progress
      </button>
    </div>
  )
}
