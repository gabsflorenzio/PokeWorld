"use client"

import Link from "next/link"
import { ThemeSwitcher } from "./theme-switcher"
import { Heart, Menu, X, PlayIcon as Pokeball } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function MainNav() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          {logoError ? (
            <Pokeball className="h-8 w-8 text-pokedex-accent" />
          ) : (
            <Image
              src="/pokeball.png"
              alt="Pokeball Logo"
              width={32}
              height={32}
              className="object-contain"
              onError={() => setLogoError(true)}
            />
          )}
          <span
            className={cn(
              "inline-block font-extrabold text-2xl",
              "text-pokedex-accent", // Base color
              "drop-shadow-[0_0_2px_hsl(var(--pokedex-accent))] sm:drop-shadow-[0_0_5px_hsl(var(--pokedex-accent))]", // Neon glow effect
              "font-['Pokemon_Solid']", // Custom font if available, otherwise fallback
            )}
            style={{
              // Example of inline style for more specific color/gradient if needed
              // For "Pokémon Yellow + azul" effect, you might need a text gradient or multiple shadows
              // This is a simplified example.
              textShadow: `
                1px 1px 0px hsl(var(--pokedex-accent-foreground)),
                -1px -1px 0px hsl(var(--pokedex-accent-foreground)),
                1px -1px 0px hsl(var(--pokedex-accent-foreground)),
                -1px 1px 0px hsl(var(--pokedex-accent-foreground)),
                0 0 5px hsl(var(--pokedex-accent) / 0.8),
                0 0 10px hsl(var(--pokedex-accent) / 0.6)
              `,
              color: "hsl(var(--pokedex-accent-foreground))", // Text color
            }}
          >
            Poké World
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            href="/teams"
            className="text-sm font-medium text-pokedex-text-secondary hover:text-pokedex-text-primary transition-colors flex items-center gap-1"
          >
            <Heart className="h-4 w-4" />
            Meus Times
          </Link>
          <ThemeSwitcher />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] flex flex-col">
              <div className="flex justify-between items-center pb-4 border-b">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsSheetOpen(false)}>
                  {logoError ? (
                    <Pokeball className="h-8 w-8 text-pokedex-accent" />
                  ) : (
                    <Image
                      src="/pokeball.png"
                      alt="Pokeball Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                      onError={() => setLogoError(true)}
                    />
                  )}
                  <span className="inline-block font-bold text-pokedex-text-primary">Poké World</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(false)} aria-label="Fechar menu">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col gap-4 pt-4">
                <Link
                  href="/teams"
                  className="text-lg font-medium text-pokedex-text-primary hover:text-pokedex-accent transition-colors flex items-center gap-2"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  Meus Times
                </Link>
                {/* Theme switcher is already in the header, but could be duplicated here if desired */}
              </nav>
              <div className="mt-auto text-sm text-muted-foreground">
                <p>Desenvolvido com ❤️ por v0</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
