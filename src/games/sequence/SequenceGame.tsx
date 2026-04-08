import { useState, useEffect } from 'react'
import type { SequenceConfig } from '@/levels/types'
import { generateSequence, getPatternLabel } from './engine'
import { useTimer } from '@/hooks/useTimer'
import { TimerBar } from '@/components/TimerBar'
import { playCorrect, playWrong } from '@/utils/sounds'

interface Props {
  config: SequenceConfig
  onComplete: (stars: number, timeMs: number) => void
}

export function SequenceGame({ config, onComplete }: Props) {
  const seq = generateSequence(config.pattern, config.visibleCount + config.missingCount, config.seed)
  const visible = seq.slice(0, config.visibleCount)
  const answers = seq.slice(config.visibleCount)

  const [inputs, setInputs] = useState<string[]>(Array(config.missingCount).fill(''))
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState<boolean[]>([])
  const { elapsed, remaining, isExpired, start, stop } = useTimer(config.timeLimit)

  useEffect(() => { start() }, [start])
  useEffect(() => {
    if (isExpired) { stop(); onComplete(0, (config.timeLimit ?? 60) * 1000) }
  }, [isExpired, stop, onComplete, config.timeLimit])

  function submit() {
    stop()
    const results = answers.map((ans, i) => parseInt(inputs[i]) === ans)
    setCorrect(results)
    setChecked(true)
    const allCorrect = results.every(Boolean)
    if (allCorrect) playCorrect(); else playWrong()
    const stars = !allCorrect ? 0 : elapsed <= config.starThresholds[1] ? 3 : elapsed <= config.starThresholds[0] ? 2 : 1
    setTimeout(() => onComplete(stars, elapsed * 1000), 1200)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="text-center">
        <p className="text-white/60 text-sm">Pattern type: <span className="text-brand-cyan">{getPatternLabel(config.pattern)}</span></p>
        <p className="text-white/60 text-sm mt-1">Complete the sequence</p>
      </div>
      {config.timeLimit && remaining !== undefined && (
        <TimerBar remaining={remaining} total={config.timeLimit} />
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {visible.map((n, i) => (
          <div key={i} className="card-glass px-4 py-3 text-2xl font-bold font-display text-brand-cyan min-w-[60px] text-center">
            {n}
          </div>
        ))}
        <div className="flex gap-1 items-center text-white/40 text-xl">→</div>
        {inputs.map((val, i) => (
          <input
            key={i}
            type="number"
            value={val}
            onChange={e => {
              const next = [...inputs]; next[i] = e.target.value; setInputs(next)
            }}
            disabled={checked}
            className={`
              w-16 h-14 text-center text-xl font-bold rounded-xl border outline-none
              bg-brand-card transition-colors
              ${checked
                ? correct[i]
                  ? 'border-brand-green text-brand-green'
                  : 'border-brand-red text-brand-red'
                : 'border-brand-purple/50 text-white focus:border-brand-violet'
              }
            `}
          />
        ))}
      </div>
      {!checked && (
        <button
          className="btn-primary"
          onClick={submit}
          disabled={inputs.some(v => v === '')}
        >
          Check Answer
        </button>
      )}
      {checked && (
        <p className={`font-bold text-lg ${correct.every(Boolean) ? 'text-brand-green' : 'text-brand-red'}`}>
          {correct.every(Boolean) ? '✓ Correct!' : `✗ Answers: ${answers.join(', ')}`}
        </p>
      )}
    </div>
  )
}
