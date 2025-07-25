// lib/api.ts
import type { PokemonListItem, PokemonDetails, EvolutionChainNode, PokemonFormDetails } from "./types"

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
const POKEMON_SPRITE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"
const POKEMON_OFFICIAL_ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"

export async function fetchAllPokemon(limit = 1025): Promise<PokemonListItem[]> {
  try {
    const res = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch Pokémon list: ${res.statusText}`)
    }
    const data = await res.json()
    return data.results.map((pokemon: any, index: number) => ({
      id: index + 1,
      name: pokemon.name,
      url: pokemon.url,
      image: `${POKEMON_OFFICIAL_ARTWORK_BASE_URL}/${index + 1}.png`,
      sprite: `${POKEMON_SPRITE_BASE_URL}/${index + 1}.png`,
    }))
  } catch (error) {
    console.error("Erro ao buscar lista de Pokémon:", error)
    return []
  }
}

export async function fetchPokemonDetails(id: number): Promise<PokemonDetails | null> {
  try {
    const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`)
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Pokémon com ID ${id} não encontrado.`)
        return null
      }
      throw new Error(`Failed to fetch details for Pokémon ID: ${id} - ${res.statusText}`)
    }
    const data = await res.json()

    const speciesRes = await fetch(data.species.url)
    if (!speciesRes.ok) {
      throw new Error(`Failed to fetch species data for Pokémon ID: ${id} - ${speciesRes.statusText}`)
    }
    const speciesData = await speciesRes.json()

    const descriptionEntry =
      speciesData.flavor_text_entries.find((entry: any) => entry.language.name === "pt-br") ||
      speciesData.flavor_text_entries.find((entry: any) => entry.language.name === "en")

    const description = descriptionEntry
      ? descriptionEntry.flavor_text.replace(/[\n\f]/g, " ")
      : "Descrição não disponível."

    const forms: PokemonFormDetails[] = []

    // Fetch details for all varieties (forms) of this Pokémon
    for (const variety of speciesData.varieties) {
      const formRes = await fetch(variety.pokemon.url)
      if (!formRes.ok) {
        console.warn(`Failed to fetch form details for ${variety.pokemon.name}: ${formRes.statusText}`)
        continue
      }
      const formData = await formRes.json()

      const formAbilities = await Promise.all(
        formData.abilities.map(async (abilityEntry: any) => {
          const abilityRes = await fetch(abilityEntry.ability.url)
          const abilityData = await abilityRes.json()
          const abilityNamePt =
            abilityData.names.find((name: any) => name.language.name === "pt-br")?.name || abilityEntry.ability.name
          const abilityDescriptionEntry =
            abilityData.flavor_text_entries.find((entry: any) => entry.language.name === "pt-br") ||
            abilityData.flavor_text_entries.find((entry: any) => entry.language.name === "en")
          return {
            name: abilityEntry.ability.name,
            name_pt: abilityNamePt,
            description: abilityDescriptionEntry
              ? abilityDescriptionEntry.flavor_text.replace(/[\n\f]/g, " ")
              : "Descrição não disponível.",
          }
        }),
      )

      const formName = variety.pokemon.name.replace(`${speciesData.name}-`, "") // e.g., "charizard-mega-x" -> "mega-x"
      const isMegaEvolution = formName.includes("mega") // Only true Mega Evolutions
      const isGigantamax = formName.includes("gmax") // Gigantamax forms
      const isRegional =
        formName.includes("alola") ||
        formName.includes("galar") ||
        formName.includes("hisui") ||
        formName.includes("paldea") ||
        formName.includes("origin") // For Giratina, Palkia, Dialga origin forms

      forms.push({
        formName: variety.pokemon.name, // Keep full name for unique key, display friendly name later
        imageUrl: formData.sprites.other["official-artwork"].front_default || formData.sprites.front_default,
        shinyImageUrl: formData.sprites.other["official-artwork"].front_shiny || formData.sprites.front_shiny,
        spriteUrl: formData.sprites.front_default,
        shinySpriteUrl: formData.sprites.front_shiny,
        types: formData.types.map((typeInfo: any) => typeInfo.type.name),
        stats: formData.stats.map((statInfo: any) => ({
          name: statInfo.stat.name,
          base_stat: statInfo.base_stat,
        })),
        abilities: formAbilities,
        isDefault: variety.is_default,
        isMegaEvolution: isMegaEvolution,
        isRegional: isRegional,
        isGigantamax: isGigantamax,
      })
    }

    // Sort forms: default first, then regional, then mega, then gigantamax, then others
    forms.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1
      if (!a.isDefault && b.isDefault) return 1

      if (a.isRegional && !b.isRegional) return -1
      if (!a.isRegional && b.isRegional) return 1

      if (a.isMegaEvolution && !b.isMegaEvolution) return -1
      if (!a.isMegaEvolution && b.isMegaEvolution) return 1

      if (a.isGigantamax && !b.isGigantamax) return -1
      if (!a.isGigantamax && b.isGigantamax) return 1

      return a.formName.localeCompare(b.formName)
    })

    return {
      id: data.id,
      name: data.name,
      description: description,
      speciesUrl: speciesData.url,
      cry: data.cries?.latest || null,
      forms: forms,
    }
  } catch (error) {
    console.error(`Erro ao buscar detalhes do Pokémon ID ${id}:`, error)
    return null
  }
}

export async function fetchEvolutionChain(speciesUrl: string): Promise<EvolutionChainNode | null> {
  try {
    const speciesRes = await fetch(speciesUrl)
    if (!speciesRes.ok) throw new Error(`Failed to fetch species data: ${speciesRes.statusText}`)
    const speciesData = await speciesRes.json()

    if (!speciesData.evolution_chain || !speciesData.evolution_chain.url) {
      return null
    }

    const evolutionChainRes = await fetch(speciesData.evolution_chain.url)
    if (!evolutionChainRes.ok) throw new Error(`Failed to fetch evolution chain: ${evolutionChainRes.statusText}`)
    const evolutionChainData = await evolutionChainRes.json()

    const parseChain = async (chainLink: any): Promise<EvolutionChainNode> => {
      const id = Number.parseInt(chainLink.species.url.split("/").slice(-2, -1)[0])
      // To get the correct sprite for evolution chain, we need to fetch the specific pokemon data
      // as species data doesn't directly provide sprites.
      const pokemonRes = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`)
      const pokemonData = pokemonRes.ok ? await pokemonRes.json() : null

      return {
        species_name: chainLink.species.name,
        species_id: id,
        image: pokemonData?.sprites.other["official-artwork"].front_default || "/placeholder.svg",
        sprite: pokemonData?.sprites.front_default || "/placeholder.svg",
        evolution_details: chainLink.evolution_details.map((detail: any) => ({
          trigger: detail.trigger.name,
          min_level: detail.min_level,
          item: detail.item?.name,
          trade_species: detail.trade_species?.name,
          held_item: detail.held_item?.name,
          known_move: detail.known_move?.name,
          known_move_type: detail.known_move_type?.name,
          location: detail.location?.name,
          min_happiness: detail.min_happiness,
          min_beauty: detail.min_beauty,
          min_affection: detail.min_affection,
          needs_overworld_rain: detail.needs_overworld_rain,
          party_species: detail.party_species?.name,
          party_type: detail.party_type?.name,
          relative_physical_stats: detail.relative_physical_stats,
          time_of_day: detail.time_of_day,
          turn_upside_down: detail.turn_upside_down,
          gender: detail.gender,
        })),
        evolves_to: await Promise.all(chainLink.evolves_to.map(parseChain)),
      }
    }

    return parseChain(evolutionChainData.chain)
  } catch (error) {
    console.error(`Erro ao buscar cadeia de evolução para ${speciesUrl}:`, error)
    return null
  }
}
