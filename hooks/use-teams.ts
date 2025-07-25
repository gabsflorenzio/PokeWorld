"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { PokemonTeam } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

interface TeamsContextType {
  teams: PokemonTeam[]
  createTeam: (name: string, pokemonIds: number[]) => void
  updateTeam: (teamId: string, name: string, pokemonIds: number[]) => void
  deleteTeam: (teamId: string) => void
  toggleTeamFavorite: (teamId: string) => void
  getPokemonTeam: (teamId: string) => PokemonTeam | undefined
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined)

export function TeamsProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<PokemonTeam[]>([])

  useEffect(() => {
    const savedTeams = localStorage.getItem("pokedex-teams")
    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams))
      } catch (e) {
        console.error("Erro ao carregar times do localStorage:", e)
        setTeams([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("pokedex-teams", JSON.stringify(teams))
  }, [teams])

  const createTeam = (name: string, pokemonIds: number[]) => {
    const newTeam: PokemonTeam = {
      id: uuidv4(),
      name,
      pokemonIds,
      isFavorite: false,
    }
    setTeams((prev) => [...prev, newTeam])
  }

  const updateTeam = (teamId: string, name: string, pokemonIds: number[]) => {
    setTeams((prev) => prev.map((team) => (team.id === teamId ? { ...team, name, pokemonIds } : team)))
  }

  const deleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId))
  }

  const toggleTeamFavorite = (teamId: string) => {
    setTeams((prev) => prev.map((team) => (team.id === teamId ? { ...team, isFavorite: !team.isFavorite } : team)))
  }

  const getPokemonTeam = (teamId: string) => {
    return teams.find((team) => team.id === teamId)
  }

  return (
    <TeamsContext.Provider value={{ teams, createTeam, updateTeam, deleteTeam, toggleTeamFavorite, getPokemonTeam }}>
      {children}
    </TeamsContext.Provider>
  )
}

export function useTeams() {
  const context = useContext(TeamsContext)
  if (context === undefined) {
    throw new Error("useTeams must be used within a TeamsProvider")
  }
  return context
}
