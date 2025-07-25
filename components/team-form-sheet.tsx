"use client"

import { useState, useEffect, useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Plus, Trash2 } from "lucide-react"
import type { PokemonTeam, PokemonListItem } from "@/lib/types"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface TeamFormSheetProps {
  isOpen: boolean
  onClose: () => void
  teamToEdit: PokemonTeam | null
  allPokemon: PokemonListItem[]
  onCreate: (name: string, pokemonIds: number[]) => void
  onUpdate: (teamId: string, name: string, pokemonIds: number[]) => void
}

export function TeamFormSheet({ isOpen, onClose, teamToEdit, allPokemon, onCreate, onUpdate }: TeamFormSheetProps) {
  const [teamName, setTeamName] = useState("")
  const [selectedPokemonIds, setSelectedPokemonIds] = useState<number[]>([])
  const [searchPokemonTerm, setSearchPokemonTerm] = useState("")

  useEffect(() => {
    if (teamToEdit) {
      setTeamName(teamToEdit.name)
      setSelectedPokemonIds(teamToEdit.pokemonIds)
    } else {
      setTeamName("")
      setSelectedPokemonIds([])
    }
    setSearchPokemonTerm("") // Reset search term
  }, [isOpen, teamToEdit])

  const handleAddPokemon = (pokemonId: number) => {
    if (selectedPokemonIds.length < 6 && !selectedPokemonIds.includes(pokemonId)) {
      setSelectedPokemonIds((prev) => [...prev, pokemonId])
      setSearchPokemonTerm("") // Clear search after adding
    } else if (selectedPokemonIds.includes(pokemonId)) {
      toast({
        title: "Pokémon já adicionado",
        description: "Este Pokémon já está no seu time.",
        variant: "warning",
      })
    } else if (selectedPokemonIds.length >= 6) {
      toast({
        title: "Time cheio!",
        description: "Um time pode ter no máximo 6 Pokémon.",
        variant: "warning",
      })
    }
  }

  const handleRemovePokemon = (pokemonId: number) => {
    setSelectedPokemonIds((prev) => prev.filter((id) => id !== pokemonId))
  }

  const handleSubmit = () => {
    if (!teamName.trim()) {
      toast({
        title: "Nome do time é obrigatório",
        description: "Por favor, dê um nome ao seu time.",
        variant: "destructive",
      })
      return
    }
    if (selectedPokemonIds.length === 0) {
      toast({
        title: "Time vazio",
        description: "Adicione pelo menos um Pokémon ao seu time.",
        variant: "destructive",
      })
      return
    }

    if (teamToEdit) {
      onUpdate(teamToEdit.id, teamName, selectedPokemonIds)
      toast({
        title: "Time atualizado!",
        description: `O time "${teamName}" foi atualizado com sucesso.`,
      })
    } else {
      onCreate(teamName, selectedPokemonIds)
      toast({
        title: "Time criado!",
        description: `O time "${teamName}" foi criado com sucesso.`,
      })
    }
    onClose()
  }

  const availablePokemon = useMemo(() => {
    const lowerCaseSearch = searchPokemonTerm.toLowerCase()
    return allPokemon
      .filter(
        (p) =>
          !selectedPokemonIds.includes(p.id) &&
          (p.name.toLowerCase().includes(lowerCaseSearch) || String(p.id).includes(lowerCaseSearch)),
      )
      .slice(0, 20) // Limit results for performance
  }, [allPokemon, selectedPokemonIds, searchPokemonTerm])

  const currentTeamPokemon = useMemo(() => {
    return selectedPokemonIds
      .map((id) => allPokemon.find((p) => p.id === id))
      .filter((p) => p !== undefined) as PokemonListItem[]
  }, [selectedPokemonIds, allPokemon])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto bg-pokedex-card-bg text-pokedex-text-primary"
      >
        <SheetHeader className="relative pb-4 border-b border-pokedex-card-border">
          <SheetTitle className="text-2xl font-bold">
            {teamToEdit ? "Editar Time Pokémon" : "Criar Novo Time Pokémon"}
          </SheetTitle>
          <SheetDescription className="text-pokedex-text-secondary">Monte seu time com até 6 Pokémon.</SheetDescription>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose} aria-label="Fechar">
            <X className="h-6 w-6" />
          </Button>
        </SheetHeader>

        <div className="py-6 grid gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Nome do Time</h3>
            <Input
              placeholder="Nome do seu time"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-input text-pokedex-text-primary border-pokedex-card-border focus-visible:ring-pokedex-accent"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Pokémon do Time ({selectedPokemonIds.length}/6)</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {currentTeamPokemon.map((pokemon) => (
                <div key={pokemon.id} className="relative flex flex-col items-center bg-muted/30 rounded-md p-1">
                  <Image
                    src={pokemon.sprite || "/placeholder.svg"}
                    alt={pokemon.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                  <span className="text-xs text-pokedex-text-secondary capitalize text-center leading-tight">
                    {pokemon.name}
                  </span>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                    onClick={() => handleRemovePokemon(pokemon.id)}
                    aria-label={`Remover ${pokemon.name}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {Array.from({ length: 6 - selectedPokemonIds.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex flex-col items-center justify-center h-24 w-full bg-muted/30 rounded-md border border-dashed border-muted-foreground/20"
                >
                  <span className="text-muted-foreground text-xs">Vazio</span>
                </div>
              ))}
            </div>
          </div>

          {selectedPokemonIds.length < 6 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Adicionar Pokémon</h3>
              <Command className="rounded-lg border border-pokedex-card-border shadow-md bg-card">
                <CommandInput
                  placeholder="Buscar Pokémon..."
                  value={searchPokemonTerm}
                  onValueChange={setSearchPokemonTerm}
                  className="bg-input text-pokedex-text-primary border-pokedex-card-border focus-visible:ring-pokedex-accent"
                />
                <CommandList className="max-h-[200px] overflow-y-auto">
                  <CommandEmpty>Nenhum Pokémon encontrado.</CommandEmpty>
                  <CommandGroup>
                    {availablePokemon.map((pokemon) => (
                      <CommandItem
                        key={pokemon.id}
                        value={pokemon.name}
                        onSelect={() => handleAddPokemon(pokemon.id)}
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted"
                      >
                        <Image
                          src={pokemon.sprite || "/placeholder.svg"}
                          alt={pokemon.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                        <span className="capitalize text-pokedex-text-primary">
                          #{String(pokemon.id).padStart(3, "0")} {pokemon.name}
                        </span>
                        <Plus className="ml-auto h-4 w-4 text-pokedex-accent" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-pokedex-card-border">
          <Button
            onClick={handleSubmit}
            className="w-full bg-pokedex-accent text-pokedex-accent-foreground hover:bg-pokedex-accent/90"
          >
            {teamToEdit ? "Salvar Alterações" : "Criar Time"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
