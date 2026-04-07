// Simple logic deduction: N people, each with a unique attribute
// "Alice does NOT have the cat" / "Bob has the dog" style

export interface LogicPuzzle {
  entities: string[]
  attribute: string
  items: string[]
  clues: string[]
  solution: Record<string, string>  // entity -> item
  choices: string[]                 // for final answer question
  question: string
}

const ENTITY_SETS = [
  ['Alice', 'Bob', 'Carol'],
  ['Alice', 'Bob', 'Carol', 'Dave'],
  ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'],
  ['Alex', 'Ben', 'Cara', 'Dan'],
]
const PETS = ['cat', 'dog', 'fish', 'bird', 'hamster']
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple']
const SPORTS = ['tennis', 'soccer', 'swimming', 'chess', 'cycling']
const FOODS = ['pizza', 'sushi', 'tacos', 'pasta', 'curry']

const ATTRIBUTE_SETS = [
  { name: 'pet', items: PETS },
  { name: 'favourite color', items: COLORS },
  { name: 'sport', items: SPORTS },
  { name: 'food', items: FOODS },
]

function seededRng(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

function rngPick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateLogicPuzzle(entityCount: number, clueCount: number, seed: number): LogicPuzzle {
  const rng = seededRng(seed)
  const entities = ENTITY_SETS.find(s => s.length === entityCount) ?? ENTITY_SETS[0]
  const attrSet = rngPick(rng, ATTRIBUTE_SETS)
  const items = shuffle(attrSet.items.slice(0, entityCount), rng)

  // Build solution: entity[i] -> item[i]
  const solution: Record<string, string> = {}
  entities.forEach((e, i) => { solution[e] = items[i] })

  // Generate clues from solution
  const allClues: string[] = []
  // Positive clues
  entities.forEach(e => { allClues.push(`${e} has the ${solution[e]}.`) })
  // Negative clues
  entities.forEach(e => {
    items.filter(it => it !== solution[e]).forEach(it => {
      allClues.push(`${e} does NOT have the ${it}.`)
    })
  })

  const clues = shuffle(allClues, rng).slice(0, clueCount)

  // Pick a question: who has X or what does Y have
  const questionEntity = rngPick(rng, entities)
  const question = `What ${attrSet.name} does ${questionEntity} have?`
  const correctAnswer = solution[questionEntity]
  const choices = shuffle(items, rng)

  return {
    entities, attribute: attrSet.name, items,
    clues, solution, choices, question,
  }
}
