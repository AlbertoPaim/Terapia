"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/luana-background.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 p-6 text-center">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-block rounded-lg bg-amber-900/90 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-widest text-amber-100">
              Tribunal de Justiça do Coração
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Ter a pia
          </h1>

          <p className="text-lg font-medium text-amber-100 drop-shadow-md">
            Paim & Associados
          </p>

          <p className="mx-auto max-w-md text-sm text-white/80">
            Sua missão: Lave os 10 pratos para descobrir mensagens especiais e receber sua recompensa final!
          </p>
        </div>

        {/* Play Button */}
        <Button
          onClick={() => {
            // Tocar som de clique
            const clickSound = new Audio("/sounds/click_play.mp3")
            clickSound.play().catch(() => { })
            onStart()
          }}
          size="lg"
          className="group h-20 w-20 rounded-full bg-amber-500 text-amber-950 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-amber-400"
        >
          <Play className="h-10 w-10 transition-transform group-hover:scale-110" />
        </Button>

        <p className="text-sm text-white/60">Clique para jogar</p>
      </div>
    </div>
  )
}
