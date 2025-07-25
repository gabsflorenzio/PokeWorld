"use client"

import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Search, Filter, Heart } from "lucide-react"
import { pokemonTypeColors, generationRanges } from "@/lib/pokemon-types"
import { cn } from "@/lib/utils"

interface SearchFilterBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedType: string | null
  onTypeChange: (type: string | null) => void
  selectedGeneration: string | null
  onGenerationChange: (gen: string | null) => void
  showFavorites: boolean
  onToggleFavorites: () => void
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedGeneration,
  onGenerationChange,
  showFavorites,
  onToggleFavorites,
}: SearchFilterBarProps) {
  const allTypes = Object.keys(pokemonTypeColors)
  const allGenerations = Object.keys(generationRanges)

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg shadow-md border border-pokedex-card-border">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar Pokémon por nome ou número..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md bg-input text-pokedex-text-primary border-pokedex-card-border focus-visible:ring-pokedex-accent"
        />
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-secondary text-pokedex-text-primary border-pokedex-card-border hover:bg-secondary/80"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card text-pokedex-text-primary border-pokedex-card-border"
          >
            <DropdownMenuLabel>Filtrar por Tipo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onTypeChange(null)}
              className={cn(selectedType === null && "font-bold bg-accent/10")}
            >
              Todos os Tipos
            </DropdownMenuItem>
            {allTypes.map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => onTypeChange(type)}
                className={cn("capitalize", selectedType === type && "font-bold bg-accent/10")}
              >
                <span className={cn("w-4 h-4 rounded-full mr-2", pokemonTypeColors[type])}></span>
                {type}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filtrar por Geração</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onGenerationChange(null)}
              className={cn(selectedGeneration === null && "font-bold bg-accent/10")}
            >
              Todas as Gerações
            </DropdownMenuItem>
            {allGenerations.map((gen) => (
              <DropdownMenuItem
                key={gen}
                onClick={() => onGenerationChange(gen)}
                className={cn(selectedGeneration === gen && "font-bold bg-accent/10")}
              >
                {gen}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={showFavorites ? "default" : "outline"}
          onClick={onToggleFavorites}
          className={cn(
            "flex items-center gap-2",
            showFavorites
              ? "bg-pokedex-accent text-pokedex-accent-foreground hover:bg-pokedex-accent/90"
              : "bg-secondary text-pokedex-text-primary border-pokedex-card-border hover:bg-secondary/80",
          )}
          aria-pressed={showFavorites}
        >
          <Heart className="h-4 w-4" />
          Favoritos
        </Button>
      </div>
    </div>
  )
}
