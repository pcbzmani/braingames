import { useState, useCallback } from 'react'
import { HomeScreen } from '@/components/HomeScreen'
import { LevelMap } from '@/components/LevelMap'
import { GameScreen } from '@/components/GameScreen'
import { getLevel } from '@/levels/generator'
import { loadProgress, completeLevel, resetProgress } from '@/store/progress'

type Screen = 'home' | 'map' | 'game'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [progress, setProgress] = useState(loadProgress)
  const [currentLevelId, setCurrentLevelId] = useState(1)

  const goToLevel = useCallback((id: number) => {
    setCurrentLevelId(id)
    setScreen('game')
  }, [])

  const handleFinish = useCallback((stars: number, timeMs: number) => {
    if (stars > 0) {
      const newProgress = completeLevel(currentLevelId, stars, timeMs)
      setProgress(newProgress)
    }
  }, [currentLevelId])

  const goNext = useCallback(() => {
    const next = Math.min(currentLevelId + 1, 500)
    setCurrentLevelId(next)
  }, [currentLevelId])

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetProgress()
      setProgress(loadProgress())
      setScreen('home')
    }
  }, [])

  const config = getLevel(currentLevelId)

  return (
    <div className="min-h-dvh bg-brand-bg flex flex-col max-w-lg mx-auto w-full">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-cyan/5 rounded-full blur-3xl" />
      </div>
      <div className="relative flex-1 flex flex-col">
        {screen === 'home' && (
          <HomeScreen
            progress={progress}
            onPlay={() => goToLevel(progress.unlockedLevel)}
            onMap={() => setScreen('map')}
            onReset={handleReset}
          />
        )}
        {screen === 'map' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <button onClick={() => setScreen('home')} className="text-white/60 hover:text-white text-xl">←</button>
              <h2 className="font-display font-bold text-gradient flex-1 text-center">Level Map</h2>
              <div className="w-6" />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <LevelMap progress={progress} onSelectLevel={goToLevel} />
            </div>
          </div>
        )}
        {screen === 'game' && (
          <GameScreen
            config={config}
            onFinish={handleFinish}
            onBack={() => setScreen('map')}
            onNext={goNext}
            isLastLevel={currentLevelId === 500}
          />
        )}
      </div>
    </div>
  )
}
