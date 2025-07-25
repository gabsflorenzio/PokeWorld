"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CryButtonProps {
  cryUrl: string | null
  pokemonName: string
}

export function CryButton({ cryUrl, pokemonName }: CryButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (cryUrl && typeof cryUrl === "string") {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = cryUrl
      } else {
        audioRef.current = new Audio(cryUrl)
      }

      audioRef.current.volume = 0.7
      audioRef.current.load() // Explicitly load the audio

      const handleCanPlay = () => {
        setIsLoaded(true)
        setHasError(false)
      }
      const handleError = (e: Event) => {
        console.error(`Erro ao carregar cry para ${pokemonName} (${cryUrl}):`, e)
        setHasError(true)
        setIsLoaded(false)
        setIsPlaying(false)
      }
      const handleEnded = () => {
        setIsPlaying(false)
      }

      audioRef.current.addEventListener("canplaythrough", handleCanPlay)
      audioRef.current.addEventListener("error", handleError)
      audioRef.current.addEventListener("ended", handleEnded)

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("canplaythrough", handleCanPlay)
          audioRef.current.removeEventListener("error", handleError)
          audioRef.current.removeEventListener("ended", handleEnded)
          audioRef.current.pause()
          audioRef.current.src = "" // Clear src to release resources
        }
      }
    } else {
      // If cryUrl is null or invalid, reset states
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
      setIsLoaded(false)
      setHasError(true) // Treat as error if no valid URL
      setIsPlaying(false)
    }
  }, [cryUrl, pokemonName])

  const handleClick = async () => {
    if (audioRef.current && isLoaded && !isPlaying) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (e) {
        console.error(`Erro ao reproduzir cry para ${pokemonName}:`, e)
        setHasError(true)
        setIsPlaying(false)
      }
    } else if (isPlaying) {
      // If already playing, stop and restart (or just stop)
      audioRef.current?.pause()
      audioRef.current?.currentTime === 0 // Reset to start
      setIsPlaying(false)
    }
  }

  const buttonText = isPlaying ? "Silenciar Cry" : "Ouvir Cry"
  const buttonIcon = isPlaying ? VolumeX : Volume2

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={!isLoaded || hasError}
      className={cn(
        "flex items-center gap-1 transition-all duration-200",
        "bg-secondary text-pokedex-text-primary border-pokedex-card-border hover:bg-secondary/80",
        isPlaying && "animate-pulse-once", // Custom animation class
        hasError && "opacity-50 cursor-not-allowed",
      )}
      aria-label={isPlaying ? `Silenciar cry de ${pokemonName}` : `Ouvir cry de ${pokemonName}`}
    >
      {buttonIcon && (
        <span className={cn("h-4 w-4", isPlaying && "text-pokedex-accent")}>{React.createElement(buttonIcon)}</span>
      )}
      {buttonText}
    </Button>
  )
}
