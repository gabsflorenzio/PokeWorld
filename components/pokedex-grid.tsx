"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { PokemonCard } from "./pokemon-card"
import type { PokemonListItem, PokemonDetails } from "@/lib/types"
import { fetchAllPokemon, fetchPokemonDetails } from "@/lib/api"
import { PokemonDetailsSheet } from "./pokemon-details-sheet"
import { SearchFilterBar } from "./search-filter-bar"
import { useFavorites } from "@/hooks/use-favorites"
import { generationRanges } from "@/lib/pokemon-types"
import { Loader2 } from "lucide-react"
import { useAudioPlayer } from "@/hooks/use-audio-player" // Import the new hook

export function PokedexGrid() {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedPokemonDetails, setSelectedPokemonDetails] = useState<PokemonDetails | null>(null)
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const { favorites, isFavorite } = useFavorites()
  const { playCry } = useAudioPlayer() // Use the new hook

  useEffect(() => {
    const loadPokemon = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAllPokemon()
        setAllPokemon(data)
      } catch (err) {
        setError("Falha ao carregar Pokémon. Tente novamente mais tarde.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPokemon()
  }, [])

  const filteredPokemon = useMemo(() => {
    let filtered = allPokemon

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          String(p.id).padStart(3, "0").includes(lowerCaseSearchTerm),
      )
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter((p) => isFavorite(p.id))
    }

    // Filter by generation
    if (selectedGeneration) {
      const range = generationRanges[selectedGeneration]
      if (range) {
        filtered = filtered.filter((p) => p.id >= range.start && p.id <= range.end)
      }
    }

    // Type filtering is complex without pre-fetched types.
    // For now, the type filter will not apply to the main grid to avoid N+1 requests.
    // It's primarily for the details view.
    // If type filtering is critical for the main grid, it would require a different API approach or pre-processing.

    return filtered
  }, [allPokemon, searchTerm, showFavoritesOnly, isFavorite, selectedGeneration])

  const handlePokemonClick = useCallback(async (pokemonId: number) => {
    setLoadingDetails(true)
    const details = await fetchPokemonDetails(pokemonId)
    setSelectedPokemonDetails(details)
    setIsDetailsSheetOpen(true)
    setLoadingDetails(false)
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-pokedex-text-primary">Pokédex</h1>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedGeneration={selectedGeneration}
        onGenerationChange={setSelectedGeneration}
        showFavorites={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64 text-pokedex-text-secondary">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          Carregando Pokémon...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredPokemon.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-pokedex-text-secondary">
          <p>Nenhum Pokémon encontrado com os filtros aplicados.</p>
        </div>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={handlePokemonClick} />
          ))}
        </section>
      )}

      <PokemonDetailsSheet
        pokemon={selectedPokemonDetails}
        isOpen={isDetailsSheetOpen}
        onClose={() => setIsDetailsSheetOpen(false)}
      />

      {loadingDetails && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-pokedex-accent" />
          <span className="sr-only">Carregando detalhes do Pokémon...</span>
        </div>
      )}
    </main>
  )
}
