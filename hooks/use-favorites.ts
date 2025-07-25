"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: number[]
  toggleFavorite: (pokemonId: number) => void
  isFavorite: (pokemonId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("pokedex-favorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error("Erro ao carregar favoritos do localStorage:", e)
        setFavorites([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("pokedex-favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (pokemonId: number) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(pokemonId)) {
        return prevFavorites.filter((id) => id !== pokemonId)
      } else {
        return [...prevFavorites, pokemonId]
      }
    })
  }

  const isFavorite = (pokemonId: number) => favorites.includes(pokemonId)

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
