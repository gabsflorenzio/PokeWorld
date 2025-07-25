"use client"

import { useMemo } from "react"

import type React from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PokemonDetails, PokemonFormDetails } from "@/lib/types"
import { pokemonTypeColors, typeIcons } from "@/lib/pokemon-types"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { FavoriteButton } from "./favorite-button"
import { X, Sparkles, Heart, Sword, Shield, Zap, Dices } from "lucide-react"
import { Button } from "@/components/ui/button"
// Removed EvolutionChain import as it's no longer used
import { useEffect, useState } from "react"
import { CryButton } from "./cry-button"

const STAT_ORDER = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"]

const statIcons: { [key: string]: React.ElementType } = {
  hp: Heart,
  attack: Sword,
  defense: Shield,
  "special-attack": Sparkles, // Using Sparkles for Sp. Attack
  "special-defense": Shield, // Reusing Shield for Sp. Defense
  speed: Zap,
}

interface PokemonDetailsSheetProps {
  pokemon: PokemonDetails | null
  isOpen: boolean
  onClose: () => void
}

export function PokemonDetailsSheet({ pokemon, isOpen, onClose }: PokemonDetailsSheetProps) {
  const [showShiny, setShowShiny] = useState(false)
  const [selectedFormName, setSelectedFormName] = useState<string | null>(null)

  const currentForm = useMemo(() => {
    return selectedFormName
      ? pokemon?.forms.find((form) => form.formName === selectedFormName)
      : pokemon?.forms.find((form) => form.isDefault) || pokemon?.forms[0]
  }, [selectedFormName, pokemon])

  useEffect(() => {
    setShowShiny(false) // Reset shiny state when opening new pokemon
    // Set default form when sheet opens
    if (pokemon && pokemon.forms.length > 0) {
      const defaultForm = pokemon.forms.find((form) => form.isDefault) || pokemon.forms[0]
      setSelectedFormName(defaultForm.formName)
    } else {
      setSelectedFormName(null)
    }
  }, [isOpen, pokemon])

  if (!pokemon || !currentForm) return null

  const formattedId = String(pokemon.id).padStart(3, "0")
  const maxStatValue = 255 // Max base stat in Pokémon games

  const currentImage = showShiny ? currentForm.shinyImageUrl : currentForm.imageUrl
  const currentSprite = showShiny ? currentForm.shinySpriteUrl : currentForm.spriteUrl

  const getFormDisplayName = (form: PokemonFormDetails) => {
    if (form.isDefault) return "Normal"
    if (form.isMegaEvolution) {
      // Use isMegaEvolution
      if (form.formName.includes("x")) return "Mega X"
      if (form.formName.includes("y")) return "Mega Y"
      return "Mega"
    }
    if (form.isGigantamax) {
      // New Gigantamax display
      return "Gigantamax"
    }
    if (form.isRegional) {
      if (form.formName.includes("alola")) return "Alola"
      if (form.formName.includes("galar")) return "Galar"
      if (form.formName.includes("hisui")) return "Hisui"
      if (form.formName.includes("paldea")) return "Paldea"
      if (form.formName.includes("origin")) return "Origem"
      return "Regional"
    }
    // Fallback for other specific forms not covered by the above
    const cleanedName = form.formName.replace(pokemon.name + "-", "").replace("-", " ")
    return cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1) || "Outra Forma"
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto bg-pokedex-card-bg text-pokedex-text-primary"
      >
        <SheetHeader className="relative pb-4 border-b border-pokedex-card-border">
          <SheetTitle className="capitalize text-3xl font-bold">
            {pokemon.name} <span className="text-pokedex-text-secondary text-xl">#{formattedId}</span>
          </SheetTitle>
          <SheetDescription className="text-pokedex-text-secondary">Detalhes completos do Pokémon.</SheetDescription>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose} aria-label="Fechar">
            <X className="h-6 w-6" />
          </Button>
        </SheetHeader>

        <div className="flex flex-col items-center py-6">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-4">
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={`${pokemon.name} ${getFormDisplayName(currentForm)}`}
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-center">
            <FavoriteButton pokemonId={pokemon.id} />
            {currentForm.shinyImageUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShiny((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1",
                  showShiny
                    ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                    : "bg-secondary text-pokedex-text-primary border-pokedex-card-border hover:bg-secondary/80",
                )}
                aria-pressed={showShiny}
              >
                <Sparkles className="h-4 w-4" />
                {showShiny ? "Normal" : "Shiny"}
              </Button>
            )}
            {pokemon.cry && <CryButton cryUrl={pokemon.cry} pokemonName={pokemon.name} />}
          </div>

          {pokemon.forms.length > 1 && (
            <div className="mt-4 w-full max-w-[200px]">
              <Select value={selectedFormName || ""} onValueChange={setSelectedFormName}>
                <SelectTrigger className="w-full bg-input text-pokedex-text-primary border-pokedex-card-border focus-visible:ring-pokedex-accent">
                  <Dices className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Selecionar Forma" />
                </SelectTrigger>
                <SelectContent className="bg-card text-pokedex-text-primary border-pokedex-card-border">
                  {pokemon.forms.map((form) => (
                    <SelectItem key={form.formName} value={form.formName}>
                      {getFormDisplayName(form)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Tabs defaultValue="details" className="w-full">
          {/* Ajustado para uma única coluna, pois só há a aba de Detalhes */}
          <TabsList className="grid w-full grid-cols-1 bg-muted text-muted-foreground">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            {/* Aba de Evolução removida */}
          </TabsList>
          <TabsContent value="details" className="pt-4">
            <div className="grid gap-4 pb-6 border-b border-pokedex-card-border">
              <h4 className="text-lg font-semibold">Descrição:</h4>
              <p className="text-pokedex-text-secondary text-sm leading-relaxed">{pokemon.description}</p>
            </div>

            <div className="grid gap-4 py-6 border-b border-pokedex-card-border">
              <h4 className="text-lg font-semibold">Tipo(s):</h4>
              <div className="flex flex-wrap gap-2">
                {currentForm.types.map((type) => (
                  <span
                    key={type}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1",
                      pokemonTypeColors[type] || "bg-gray-500 text-white",
                    )}
                  >
                    {typeIcons[type]} {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 py-6 border-b border-pokedex-card-border">
              <h4 className="text-lg font-semibold">Status Base:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {STAT_ORDER.map((statName) => {
                  const stat = currentForm.stats.find((s) => s.name === statName)
                  if (!stat) return null // Skip if stat not found

                  const StatIcon = statIcons[stat.name]

                  return (
                    <div key={stat.name} className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize text-pokedex-text-secondary flex items-center gap-1 w-24">
                        {StatIcon && <StatIcon className="h-4 w-4" />}
                        {stat.name.replace("special-", "Sp. ")}:
                      </span>
                      <Progress
                        value={(stat.base_stat / maxStatValue) * 100}
                        className="h-2 flex-1 bg-muted rounded-full"
                        indicatorClassName="bg-pokedex-accent" // Usando a cor de destaque do tema
                      />
                      <span className="text-sm font-bold text-pokedex-text-primary text-right w-10">
                        {stat.base_stat}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4 py-6">
              <h4 className="text-lg font-semibold">Habilidades:</h4>
              <div className="grid gap-3">
                {currentForm.abilities.map((ability) => (
                  <div key={ability.name} className="grid gap-1">
                    <h5 className="font-medium capitalize text-pokedex-text-primary">{ability.name_pt}</h5>
                    <p className="text-pokedex-text-secondary text-sm leading-relaxed">{ability.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          {/* Conteúdo da aba de Evolução removido */}
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
