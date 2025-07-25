"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Share2, Star } from "lucide-react"
import Image from "next/image"
import type { PokemonTeam, PokemonListItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TeamCardProps {
  team: PokemonTeam
  allPokemon: PokemonListItem[]
  onEdit: (team: PokemonTeam) => void
  onDelete: (teamId: string) => void
  onToggleFavorite: (teamId: string) => void
  onShare: (team: PokemonTeam) => void
}

export function TeamCard({ team, allPokemon, onEdit, onDelete, onToggleFavorite, onShare }: TeamCardProps) {
  const teamPokemon = team.pokemonIds
    .map((id) => allPokemon.find((p) => p.id === id))
    .filter((p) => p !== undefined) as PokemonListItem[]

  return (
    <Card className="bg-pokedex-card-bg border-pokedex-card-border shadow-pokedex-shadow flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-pokedex-text-primary capitalize">{team.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite(team.id)}
          className={cn(
            "rounded-full transition-colors duration-200",
            team.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-foreground",
          )}
          aria-label={team.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star className={cn("w-5 h-5", team.isFavorite && "fill-current")} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        {teamPokemon.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {teamPokemon.map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col items-center">
                <Image
                  src={pokemon.sprite || "/placeholder.svg"} // Use smaller sprite for team cards
                  alt={pokemon.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <span className="text-xs text-pokedex-text-secondary capitalize text-center">{pokemon.name}</span>
              </div>
            ))}
            {Array.from({ length: 6 - teamPokemon.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex flex-col items-center justify-center h-24 w-full bg-muted/30 rounded-md border border-dashed border-muted-foreground/20"
              >
                <span className="text-muted-foreground text-xs">Vazio</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-pokedex-text-secondary text-center py-4">Nenhum Pokémon neste time.</p>
        )}
      </CardContent>
      <div className="flex justify-end gap-2 p-4 pt-0">
        <Button variant="outline" size="icon" onClick={() => onEdit(team)} aria-label="Editar time">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onShare(team)} aria-label="Compartilhar time">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDelete(team.id)} aria-label="Excluir time">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
