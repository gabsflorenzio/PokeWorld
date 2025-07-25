"use client"

import { useState, useEffect } from "react"
import { fetchEvolutionChain } from "@/lib/api"
import type { EvolutionChainNode } from "@/lib/types"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EvolutionChainProps {
  speciesUrl: string | null | undefined
}

const EvolutionStage = ({ node }: { node: EvolutionChainNode }) => {
  const formattedId = String(node.species_id).padStart(3, "0")

  const getEvolutionCondition = (details: any[]) => {
    if (!details || details.length === 0) return "N/A"
    const detail = details[0] // Assuming one main detail for simplicity

    if (detail.trigger === "level-up") {
      if (detail.min_level) return `Nível ${detail.min_level}`
      if (detail.min_happiness) return `Felicidade ${detail.min_happiness}`
      if (detail.time_of_day) return `Dia (${detail.time_of_day})`
      return "Por Nível"
    }
    if (detail.trigger === "trade") {
      return `Troca${detail.held_item ? ` com ${detail.held_item}` : ""}`
    }
    if (detail.trigger === "use-item" && detail.item) {
      return `Usar ${detail.item}`
    }
    if (detail.trigger === "other") {
      return "Condição Especial"
    }
    return "Condição Desconhecida"
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-full flex items-center justify-center overflow-hidden border-2 border-pokedex-card-border">
        <Image
          src={node.sprite || "/placeholder.svg"}
          alt={node.species_name}
          width={128}
          height={128}
          className="object-contain"
        />
      </div>
      <p className="text-sm text-pokedex-text-secondary mt-1">#{formattedId}</p>
      <h3 className="text-lg font-semibold capitalize text-pokedex-text-primary">{node.species_name}</h3>
      {node.evolution_details.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">({getEvolutionCondition(node.evolution_details)})</p>
      )}
    </div>
  )
}

export function EvolutionChain({ speciesUrl }: EvolutionChainProps) {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChainNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEvolutionChain = async () => {
      setLoading(true)
      setError(null)
      try {
        const chain = await fetchEvolutionChain(speciesUrl as string) // Cast to string after check
        setEvolutionChain(chain)
      } catch (err) {
        console.error("Erro ao carregar cadeia de evolução:", err)
        setError("Falha ao carregar cadeia de evolução.")
      } finally {
        setLoading(false)
      }
    }

    // Only attempt to load if speciesUrl is a valid string
    if (typeof speciesUrl === "string" && speciesUrl.length > 0) {
      loadEvolutionChain()
    } else {
      setLoading(false)
      setError("URL da espécie não disponível para a cadeia de evolução.")
      setEvolutionChain(null) // Ensure no stale data is shown
    }
  }, [speciesUrl])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-pokedex-accent" />
        <span className="ml-2 text-pokedex-text-secondary">Carregando cadeia de evolução...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    )
  }

  if (!evolutionChain) {
    return (
      <div className="text-center text-pokedex-text-secondary py-8">
        <p>Cadeia de evolução não disponível para este Pokémon.</p>
      </div>
    )
  }

  const renderChain = (node: EvolutionChainNode, isFirst = true) => (
    <div key={node.species_id} className="flex flex-col items-center">
      <EvolutionStage node={node} />
      {node.evolves_to.length > 0 && (
        <div className={cn("flex flex-col items-center mt-4", node.evolves_to.length > 1 && "sm:flex-row sm:gap-8")}>
          {node.evolves_to.map((nextStage, index) => (
            <div key={nextStage.species_id} className="flex flex-col items-center">
              <span className="text-pokedex-text-secondary text-2xl my-2">↓</span>
              {renderChain(nextStage, false)}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return <div className="py-4 flex justify-center">{renderChain(evolutionChain)}</div>
}
