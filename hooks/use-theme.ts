"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type PokedexTheme, pokedexThemes } from "@/lib/themes"

interface ThemeContextType {
  theme: PokedexTheme
  setTheme: (themeId: string) => void
  currentThemeId: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<string>("midnight-black-dark") // Default theme

  useEffect(() => {
    const savedThemeId = localStorage.getItem("pokedex-theme")
    if (savedThemeId && pokedexThemes.some((t) => t.id === savedThemeId)) {
      setCurrentThemeId(savedThemeId)
    }
  }, [])

  useEffect(() => {
    const theme = pokedexThemes.find((t) => t.id === currentThemeId)
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme.id)
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
      localStorage.setItem("pokedex-theme", theme.id)
    }
  }, [currentThemeId])

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId)
  }

  const theme = pokedexThemes.find((t) => t.id === currentThemeId) || pokedexThemes[0] // Fallback to first theme

  return <ThemeContext.Provider value={{ theme, setTheme, currentThemeId }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
