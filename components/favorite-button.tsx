"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface FavoriteButtonProps {
  pokemonId: number
  className?: string
}

export function FavoriteButton({ pokemonId, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isAnimating, setIsAnimating] = useState(false)

  const favorited = isFavorite(pokemonId)

  const handleClick = () => {
    toggleFavorite(pokemonId)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600) // Match animation duration
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        "rounded-full transition-colors duration-200",
        favorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        className={cn(
          "w-6 h-6",
          favorited && "fill-current",
          isAnimating && (favorited ? "animate-heart-beat" : "animate-star-fill"), // Use heart-beat for favoriting, star-fill for unfavoriting
        )}
      />
    </Button>
  )
}
