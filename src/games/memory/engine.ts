// Pure memory match game engine

const EMOJIS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
  '🦁','🐮','🐷','🐸','🐵','🦋','🐢','🦖','🦕','🐙',
  '🦑','🦀','🐡','🐠','🐟','🦜','🦢','🦩','🕊️','🦚',
  '🌸','🌺','🌻','🌹','🌷','🍀','🌿','🍁','🍄','🌊',
  '⚡','🔥','❄️','🌈','⭐','🌙','☀️','💎','🔮','🎯',
  '🚀','🛸','🎸','🎺','🎻','🥁','🎹','🎮','🕹️','🏆',
]

export interface MemCard {
  id: number
  emoji: string
  pairId: number
  flipped: boolean
  matched: boolean
}

export function createBoard(pairs: number, seed: number): MemCard[] {
  const selected = EMOJIS.slice(0, pairs)
  const cards: MemCard[] = []
  selected.forEach((emoji, i) => {
    cards.push({ id: i * 2, emoji, pairId: i, flipped: false, matched: false })
    cards.push({ id: i * 2 + 1, emoji, pairId: i, flipped: false, matched: false })
  })
  // Seeded Fisher-Yates shuffle
  let s = seed
  const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

export function checkMatch(cards: MemCard[], a: number, b: number): boolean {
  return cards[a].pairId === cards[b].pairId
}

export function isComplete(cards: MemCard[]): boolean {
  return cards.every(c => c.matched)
}
