// lib/types.ts
export interface PokemonListItem {
  id: number
  name: string
  url: string
  image: string
  sprite: string // Smaller sprite for team cards
}

export interface PokemonStat {
  name: string
  base_stat: number
}

export interface PokemonAbility {
  name: string
  name_pt: string // Name in Portuguese
  description: string
}

export interface EvolutionDetail {
  trigger: string
  min_level?: number
  item?: string
  trade_species?: string
  held_item?: string
  known_move?: string
  known_move_type?: string
  location?: string
  min_happiness?: number
  min_beauty?: number
  min_affection?: number
  needs_overworld_rain?: boolean
  party_species?: string
  party_type?: string
  relative_physical_stats?: number
  time_of_day?: string
  turn_upside_down?: boolean
  gender?: number
  // Add other relevant evolution details as needed
}

export interface EvolutionChainNode {
  species_name: string
  species_id: number
  image: string
  sprite: string
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionChainNode[]
}

// New interface for individual Pokémon forms (default, regional, mega, gigantamax)
export interface PokemonFormDetails {
  formName: string // e.g., "default", "mega-x", "alola", "galar", "gmax"
  imageUrl: string // Official artwork for this form
  shinyImageUrl: string // Official shiny artwork for this form
  spriteUrl: string // Default sprite for this form
  shinySpriteUrl: string // Shiny sprite for this form
  types: string[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  isDefault: boolean
  isMegaEvolution: boolean // Renamed from isMega
  isRegional: boolean
  isGigantamax: boolean // New field
  // Add other form-specific data if needed
}

export interface PokemonDetails {
  id: number
  name: string
  image: string // Official artwork
  shinyImage: string // Official shiny artwork
  sprite: string // Default sprite
  shinySprite: string // Shiny sprite
  types: string[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  description: string
  speciesUrl: string // URL to fetch species data for evolution chain
  cry: string // URL for Pokémon cry audio
  forms: PokemonFormDetails[] // Array of all available forms for this Pokémon
}

export interface PokemonTeam {
  id: string
  name: string
  pokemonIds: number[]
  isFavorite: boolean
}

export type ThemeType = "light" | "dark"

export interface ThemeColorVariables {
  "--background": string
  "--foreground": string
  "--card": string
  "--card-foreground": string
  "--popover": string
  "--popover-foreground": string
  "--primary": string
  "--primary-foreground": string
  "--secondary": string
  "--secondary-foreground": string
  "--muted": string
  "--muted-foreground": string
  "--accent": string
  "--accent-foreground": string
  "--destructive": string
  "--destructive-foreground": string
  "--border": string
  "--input": string
  "--ring": string
  "--radius": string
  // Custom Pokedex specific variables
  "--pokedex-bg-gradient-start": string
  "--pokedex-bg-gradient-end": string
  "--pokedex-card-bg": string
  "--pokedex-card-border": string
  "--pokedex-text-primary": string
  "--pokedex-text-secondary": string
  "--pokedex-accent": string
  "--pokedex-accent-foreground": string
  "--pokedex-neon-glow": string
  "--pokedex-shadow": string
}

export interface PokedexTheme {
  id: string
  name: string
  type: ThemeType
  colors: ThemeColorVariables
}
