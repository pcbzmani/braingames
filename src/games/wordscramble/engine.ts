const WORD_BANK: Record<string, string[]> = {
  animals: ['elephant', 'giraffe', 'dolphin', 'penguin', 'cheetah', 'gorilla', 'leopard', 'flamingo',
            'crocodile', 'kangaroo', 'octopus', 'hamster', 'panther', 'buffalo', 'peacock', 'lobster',
            'jaguar', 'parrot', 'turtle', 'falcon', 'eagle', 'cobra', 'viper', 'lemur', 'otter',
            'beaver', 'badger', 'ferret', 'marmot', 'iguana', 'gecko', 'toucan', 'condor', 'panda'],
  countries: ['france', 'brazil', 'canada', 'mexico', 'sweden', 'turkey', 'poland', 'greece',
              'israel', 'jordan', 'ukraine', 'portugal', 'denmark', 'finland', 'austria', 'belgium',
              'norway', 'ireland', 'iceland', 'nigeria', 'kenya', 'ghana', 'egypt', 'morocco', 'peru',
              'chile', 'colombia', 'venezuela', 'argentina', 'ecuador', 'bolivia', 'paraguay'],
  science:  ['gravity', 'neutron', 'proton', 'carbon', 'oxygen', 'hydrogen', 'nucleus', 'photon',
             'electron', 'quantum', 'plasma', 'osmosis', 'enzymes', 'protein', 'genome', 'fossil',
             'mineral', 'crystal', 'magnet', 'voltage', 'circuit', 'thermal', 'entropy', 'density'],
  sports:   ['tennis', 'soccer', 'cricket', 'hockey', 'archery', 'boxing', 'cycling', 'fencing',
             'surfing', 'rowing', 'diving', 'karate', 'judo', 'squash', 'rugby', 'baseball',
             'volleyball', 'handball', 'lacrosse', 'gymnastics', 'triathlon', 'marathon'],
  food:     ['avocado', 'broccoli', 'spinach', 'asparagus', 'zucchini', 'eggplant', 'pumpkin',
             'paprika', 'cinnamon', 'turmeric', 'rosemary', 'lavender', 'cilantro', 'tarragon',
             'saffron', 'cardamom', 'nutmeg', 'vanilla', 'coconut', 'mango', 'papaya', 'guava'],
}

function seededRng(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

function scramble(word: string, rng: () => number): string {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // Ensure it's actually different
  const result = arr.join('')
  return result === word ? arr.reverse().join('') : result
}

export interface ScrambledWord {
  original: string
  scrambled: string
  hint: string   // first letter + length
}

export function generateScrambles(category: string, count: number, seed: number): ScrambledWord[] {
  const rng = seededRng(seed)
  const bank = WORD_BANK[category] ?? WORD_BANK.animals
  // Pick `count` unique words
  const pool = [...bank].sort(() => rng() - 0.5).slice(0, count)
  return pool.map(word => ({
    original: word,
    scrambled: scramble(word, rng),
    hint: `${word[0].toUpperCase()}${'_'.repeat(word.length - 1)} (${word.length} letters)`,
  }))
}
