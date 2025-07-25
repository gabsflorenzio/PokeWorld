"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume1, Volume2, VolumeX, SkipForward, SkipBack } from "lucide-react"
// Removed useAudioPlayer import as this component is no longer directly playing cries from context

interface AudioPlayerProps {
  tracks: { name: string; src: string }[]
  // Removed cryUrlToPlay prop as cry playback is now handled by CryButton
}

// This component is now purely for background music playback (if re-enabled)
// and does not handle Pokémon cries directly.
export function AudioPlayer({ tracks }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5) // 0.0 to 1.0
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  const currentTrack = tracks[currentTrackIndex]

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] / 100
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume > 0 ? volume : 0.5 // Restore previous volume or default
        setVolume(volume > 0 ? volume : 0.5)
      } else {
        audioRef.current.volume = 0
        setVolume(0)
      }
      setIsMuted(!isMuted)
    }
  }, [isMuted, volume])

  const playNextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length)
  }, [tracks.length])

  const playPreviousTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length)
  }, [tracks.length])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.onended = playNextTrack // Auto-play next track
      audioRef.current.onplay = () => setIsPlaying(true)
      audioRef.current.onpause = () => setIsPlaying(false)
    }
  }, [volume, playNextTrack])

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load() // Load new track
      // Removed auto-play on track change to ensure silence by default
      // if (isPlaying) {
      //   audioRef.current.play();
      // }
    }
  }, [currentTrack]) // Removed isPlaying from dependencies to prevent auto-play on state changes

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  if (tracks.length === 0) return null // Only render if there are tracks

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card p-3 rounded-lg shadow-lg border border-pokedex-card-border flex items-center gap-3">
      <audio ref={audioRef} src={currentTrack?.src} preload="auto" />

      <Button variant="ghost" size="icon" onClick={playPreviousTrack} aria-label="Faixa anterior">
        <SkipBack className="h-5 w-5 text-pokedex-text-primary" />
      </Button>
      <Button variant="ghost" size="icon" onClick={togglePlayPause} aria-label={isPlaying ? "Pausar" : "Reproduzir"}>
        {isPlaying ? (
          <Pause className="h-6 w-6 text-pokedex-accent" />
        ) : (
          <Play className="h-6 w-6 text-pokedex-accent" />
        )}
      </Button>
      <Button variant="ghost" size="icon" onClick={playNextTrack} aria-label="Próxima faixa">
        <SkipForward className="h-5 w-5 text-pokedex-text-primary" />
      </Button>

      <div className="flex items-center gap-2 w-24">
        <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted ? "Desmutar" : "Mutar"}>
          <VolumeIcon className="h-5 w-5 text-pokedex-text-primary" />
        </Button>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-muted [&>span:first-child>span]:bg-pokedex-accent"
          aria-label="Controle de volume"
        />
      </div>
      <span className="text-sm text-pokedex-text-secondary hidden sm:block">
        {currentTrack?.name || "Nenhuma faixa"}
      </span>
    </div>
  )
}
