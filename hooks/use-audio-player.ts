"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"

interface AudioPlayerContextType {
  // playCry will now be handled directly by the CryButton component
  // This context will primarily be for future global audio controls if needed,
  // but for now, it's simplified as the cry playback is localized.
  // Keeping it for potential future expansion or if other components need to trigger a cry.
  triggerCry: (cryUrl: string | null) => void
  currentTriggeredCry: string | null
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTriggeredCry, setCurrentTriggeredCry] = useState<string | null>(null)

  const triggerCry = useCallback((cryUrl: string | null) => {
    setCurrentTriggeredCry(cryUrl)
    // Clear the URL after a short delay to ensure the CryButton processes it
    // and to prevent re-playing if the same URL is set again immediately.
    if (cryUrl) {
      setTimeout(() => setCurrentTriggeredCry(null), 100)
    }
  }, [])

  return (
    <AudioPlayerContext.Provider value={{ triggerCry, currentTriggeredCry }}>{children}</AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
  }
  return context
}
