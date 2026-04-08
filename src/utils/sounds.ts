// Web Audio API sound engine — no external files, zero bundle cost

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainVal = 0.3,
  startOffset = 0
) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime + startOffset)
  gain.gain.setValueAtTime(0, ac.currentTime + startOffset)
  gain.gain.linearRampToValueAtTime(gainVal, ac.currentTime + startOffset + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startOffset + duration)
  osc.start(ac.currentTime + startOffset)
  osc.stop(ac.currentTime + startOffset + duration + 0.05)
}

export function playFlip() {
  tone(600, 0.06, 'triangle', 0.15)
}

export function playCorrect() {
  tone(523, 0.1, 'sine', 0.25)       // C5
  tone(659, 0.15, 'sine', 0.25, 0.1) // E5
}

export function playWrong() {
  tone(220, 0.08, 'sawtooth', 0.2)
  tone(180, 0.15, 'sawtooth', 0.2, 0.08)
}

export function playMatch() {
  tone(523, 0.08, 'sine', 0.25)
  tone(784, 0.12, 'sine', 0.25, 0.08)
  tone(1047, 0.18, 'sine', 0.2, 0.18)
}

export function playTick() {
  tone(880, 0.04, 'square', 0.1)
}

export function playLevelComplete(stars: number) {
  if (stars === 0) {
    playWrong()
    return
  }
  if (stars === 1) {
    // Short jingle
    tone(392, 0.1, 'sine', 0.25)
    tone(523, 0.2, 'sine', 0.25, 0.12)
    return
  }
  if (stars === 2) {
    // Happy ascending
    tone(523, 0.1, 'sine', 0.3)
    tone(659, 0.1, 'sine', 0.3, 0.12)
    tone(784, 0.2, 'sine', 0.3, 0.24)
    return
  }
  // 3 stars — fanfare
  const notes = [523, 659, 784, 1047]
  notes.forEach((f, i) => tone(f, 0.18, 'sine', 0.3, i * 0.12))
  // Extra sparkle
  tone(1568, 0.3, 'triangle', 0.15, 0.5)
}

export function playMilestone() {
  // Epic chord for zone completions / milestones
  const chord = [261, 329, 392, 523]
  chord.forEach((f, i) => {
    tone(f, 0.5, 'sine', 0.2, i * 0.05)
  })
  tone(1047, 0.6, 'triangle', 0.15, 0.3)
}
