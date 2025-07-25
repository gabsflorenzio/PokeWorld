"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { PokemonListItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { FavoriteButton } from "./favorite-button"

interface PokemonCardProps {
  pokemon: PokemonListItem
  onClick: (pokemonId: number) => void
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const formattedId = String(pokemon.id).padStart(3, "0")

  return (
    <Card
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer overflow-hidden",
        "bg-pokedex-card-bg border-pokedex-card-border shadow-pokedex-shadow",
        "hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ease-in-out group",
      )}
      onClick={() => onClick(pokemon.id)}
    >
      <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
        <FavoriteButton pokemonId={pokemon.id} />
      </div>
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
        <Image
          src={pokemon.image || "/placeholder.svg"}
          alt={pokemon.name}
          width={160}
          height={160}
          className="object-contain group-hover:scale-105 transition-transform duration-200 ease-in-out"
          priority={pokemon.id <= 20} // Prioritize loading for first few Pokémon
        />
      </div>
      <CardContent className="p-0 pt-2 text-center w-full">
        <p className="text-sm font-medium text-pokedex-text-secondary">#{formattedId}</p>
        <h3 className="text-lg font-bold capitalize text-pokedex-text-primary">{pokemon.name}</h3>
        {/* Placeholder for types on card if desired, currently only in details */}
      </CardContent>
    </Card>
  )
}
