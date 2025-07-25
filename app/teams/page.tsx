"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Star } from "lucide-react"
import { useTeams } from "@/hooks/use-teams"
import { TeamCard } from "@/components/team-card"
import { TeamFormSheet } from "@/components/team-form-sheet"
import type { PokemonTeam, PokemonListItem } from "@/lib/types"
import { fetchAllPokemon } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search, Loader2 } from "lucide-react" // Import Search and Loader2
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

export default function TeamsPage() {
  const { teams, createTeam, updateTeam, deleteTeam, toggleTeamFavorite } = useTeams()
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<PokemonTeam | null>(null)
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([])
  const [loadingPokemon, setLoadingPokemon] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)

  useEffect(() => {
    const loadAllPokemon = async () => {
      setLoadingPokemon(true)
      const data = await fetchAllPokemon()
      setAllPokemon(data)
      setLoadingPokemon(false)
    }
    loadAllPokemon()
  }, [])

  const filteredTeams = useMemo(() => {
    let filtered = teams

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter((team) => team.name.toLowerCase().includes(lowerCaseSearchTerm))
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((team) => team.isFavorite)
    }

    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return a.name.localeCompare(b.name)
    })
  }, [teams, searchTerm, showFavoritesOnly])

  const handleCreateNewTeam = () => {
    setEditingTeam(null)
    setIsFormSheetOpen(true)
  }

  const handleEditTeam = (team: PokemonTeam) => {
    setEditingTeam(team)
    setIsFormSheetOpen(true)
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeamToDelete(teamId)
  }

  const confirmDeleteTeam = () => {
    if (teamToDelete) {
      deleteTeam(teamToDelete)
      setTeamToDelete(null)
      toast({
        title: "Time excluído!",
        description: "Seu time foi removido com sucesso.",
      })
    }
  }

  const handleShareTeam = (team: PokemonTeam) => {
    try {
      const teamData = JSON.stringify(team, null, 2)
      navigator.clipboard.writeText(teamData)
      toast({
        title: "Time copiado!",
        description: "Os dados do time foram copiados para a área de transferência.",
      })
    } catch (error) {
      console.error("Erro ao copiar time:", error)
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar os dados do time.",
        variant: "destructive",
      })
    }
  }

  const handleExportTeams = () => {
    try {
      const allTeamsData = JSON.stringify(teams, null, 2)
      const blob = new Blob([allTeamsData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "pokedex_teams.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: "Times exportados!",
        description: "Seus times foram exportados como pokedex_teams.json.",
      })
    } catch (error) {
      console.error("Erro ao exportar times:", error)
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar os times.",
        variant: "destructive",
      })
    }
  }

  const handleImportTeams = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedTeams: PokemonTeam[] = JSON.parse(e.target?.result as string)
          // Basic validation for imported data structure
          if (
            Array.isArray(importedTeams) &&
            importedTeams.every((team) => team.id && team.name && Array.isArray(team.pokemonIds))
          ) {
            // Merge or replace existing teams. For simplicity, let's replace for now.
            // In a real app, you might want to merge and handle ID conflicts.
            localStorage.setItem("pokedex-teams", JSON.stringify(importedTeams))
            window.location.reload() // Reload to re-initialize useTeams hook
            toast({
              title: "Times importados!",
              description: "Seus times foram importados com sucesso.",
            })
          } else {
            throw new Error("Formato de arquivo inválido.")
          }
        } catch (error) {
          console.error("Erro ao importar times:", error)
          toast({
            title: "Erro ao importar",
            description: `Não foi possível importar os times: ${error instanceof Error ? error.message : String(error)}`,
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-pokedex-text-primary">Meus Times Pokémon</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar times por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-input text-pokedex-text-primary border-pokedex-card-border focus-visible:ring-pokedex-accent"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly((prev) => !prev)}
            className={cn(
              "flex items-center gap-2",
              showFavoritesOnly
                ? "bg-pokedex-accent text-pokedex-accent-foreground hover:bg-pokedex-accent/90"
                : "bg-secondary text-pokedex-text-primary border-pokedex-card-border hover:bg-secondary/80",
            )}
            aria-pressed={showFavoritesOnly}
          >
            <Star className="h-4 w-4" />
            Favoritos
          </Button>
          <Button
            onClick={handleCreateNewTeam}
            className="bg-pokedex-accent text-pokedex-accent-foreground hover:bg-pokedex-accent/90 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Novo Time
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" onClick={handleExportTeams} size="sm">
          Exportar Times
        </Button>
        <label
          htmlFor="import-teams"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
        >
          Importar Times
          <Input id="import-teams" type="file" accept=".json" onChange={handleImportTeams} className="sr-only" />
        </label>
      </div>

      {loadingPokemon ? (
        <div className="flex justify-center items-center h-64 text-pokedex-text-secondary">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          Carregando dados de Pokémon para times...
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center text-pokedex-text-secondary py-16">
          <p className="text-lg mb-4">Nenhum time encontrado.</p>
          <Button
            onClick={handleCreateNewTeam}
            className="bg-pokedex-accent text-pokedex-accent-foreground hover:bg-pokedex-accent/90 flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Crie seu primeiro time!
          </Button>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              allPokemon={allPokemon}
              onEdit={handleEditTeam}
              onDelete={handleDeleteTeam}
              onToggleFavorite={toggleTeamFavorite}
              onShare={handleShareTeam}
            />
          ))}
        </section>
      )}

      <TeamFormSheet
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        teamToEdit={editingTeam}
        allPokemon={allPokemon}
        onCreate={createTeam}
        onUpdate={updateTeam}
      />

      <AlertDialog open={teamToDelete !== null} onOpenChange={() => setTeamToDelete(null)}>
        <AlertDialogContent className="bg-card text-foreground border-pokedex-card-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTeam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
