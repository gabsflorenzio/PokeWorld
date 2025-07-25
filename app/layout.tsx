import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/hooks/use-theme"
import { FavoritesProvider } from "@/hooks/use-favorites"
import { TeamsProvider } from "@/hooks/use-teams"
import { AudioPlayerProvider } from "@/hooks/use-audio-player" // Keep AudioPlayerProvider for context
import { MainNav } from "@/components/main-nav"
// Removed AudioPlayer import as it's no longer used for global background music

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Poké World",
  description: "Uma Pokédex completa e responsiva com temas personalizáveis e gerenciamento de times.",
    generator: 'v0.dev'
}

// Removed globalAudioTracks as background music is no longer auto-playing

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/pokeball.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <FavoritesProvider>
            <TeamsProvider>
              <AudioPlayerProvider>
                {" "}
                {/* Keep AudioPlayerProvider for cry functionality */}
                <div className="min-h-screen flex flex-col bg-gradient-to-br from-pokedex-bg-gradient-start to-pokedex-bg-gradient-end">
                  <MainNav />
                  {children}
                  {/* Removed AudioPlayer component here */}
                </div>
              </AudioPlayerProvider>
            </TeamsProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
