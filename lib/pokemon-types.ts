// lib/pokemon-types.ts
export const pokemonTypeColors: { [key: string]: string } = {
  normal: "bg-gray-400 text-white",
  fire: "bg-red-500 text-white",
  water: "bg-blue-500 text-white",
  grass: "bg-green-500 text-white",
  electric: "bg-yellow-400 text-gray-800",
  ice: "bg-blue-200 text-gray-800",
  fighting: "bg-red-700 text-white",
  poison: "bg-purple-600 text-white",
  ground: "bg-yellow-700 text-white",
  flying: "bg-indigo-400 text-white",
  psychic: "bg-pink-500 text-white",
  bug: "bg-lime-500 text-gray-800",
  rock: "bg-stone-600 text-white",
  ghost: "bg-purple-800 text-white",
  dragon: "bg-indigo-700 text-white",
  steel: "bg-gray-500 text-white",
  fairy: "bg-pink-300 text-gray-800",
  dark: "bg-gray-800 text-white",
}

export const statColors: { [key: string]: string } = {
  hp: "bg-green-500",
  attack: "bg-red-500",
  defense: "bg-blue-500",
  "special-attack": "bg-orange-500",
  "special-defense": "bg-cyan-500",
  speed: "bg-pink-500",
}

export const typeIcons: { [key: string]: string } = {
  normal: "⚪",
  fire: "🔥",
  water: "💧",
  grass: "🌿",
  electric: "⚡",
  ice: "❄️",
  fighting: "🥊",
  poison: "☠️",
  ground: "🌍",
  flying: "🦅",
  psychic: "🧠",
  bug: "🐛",
  rock: "🪨",
  ghost: "👻",
  dragon: "🐉",
  steel: "⚙️",
  fairy: "✨",
  dark: "🌑",
}

export const generationRanges: { [key: string]: { start: number; end: number } } = {
  "Geração 1": { start: 1, end: 151 },
  "Geração 2": { start: 152, end: 251 },
  "Geração 3": { start: 252, end: 386 },
  "Geração 4": { start: 387, end: 493 },
  "Geração 5": { start: 494, end: 649 },
  "Geração 6": { start: 650, end: 721 },
  "Geração 7": { start: 722, end: 809 },
  "Geração 8": { start: 810, end: 905 },
  "Geração 9": { start: 906, end: 1025 }, // Current latest generation
}
