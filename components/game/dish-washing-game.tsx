"use client"

import { useState, useRef, useEffect } from "react"
import { StartScreen } from "./start-screen"
import { PlatePile } from "./plate-pile"
import { ScratchPlate } from "./scratch-plate"
import { FinalScreen } from "./final-screen"

const PHRASES = [
  "Petição inicial: Que este dia seja deferido com sucesso e muita alegria!",
  "Data venia, Luana, mas hoje você está m-a-r-a-v-i-l-h-o-s-a.",
  "Trânsito em julgado: É fato incontestável que você é a melhor namorada do mundo.",
  "Liminar concedida: Você tem o direito de gastar sem culpa pelas próximas 24h.",
  "Habeas Corpus: Liberdade para comprar aquele sapato que está no carrinho!",
  "Ação de Cobrança: Exijo 100 beijos do Alberto Paim como pagamento imediato.",
  "Jurisprudência firmada: Em todos os casos anteriores, você sempre foi incrível.",
  "Embargos de Declaração: Para deixar claro que meu amor por você é imprescritível.",
  "Código Civil, Art. 1º: Toda Luana é capaz de direitos, deveres e de zerar o limite do cartão.",
  "Sentença Final: Condenada a ser feliz ao meu lado para o resto da vida. Sem direito a recurso!",
]

type GameState = "start" | "playing" | "finished"

export function DishWashingGame() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0)
  const [hasActivePlate, setHasActivePlate] = useState(false)
  const [completedPlates, setCompletedPlates] = useState<number[]>([])
  const [showingPhrase, setShowingPhrase] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const remainingPlates = PHRASES.length - currentPlateIndex

  // Iniciar música de fundo
  const startGame = () => {
    setGameState("playing")

    // Criar audio element para música de fundo
    if (typeof window !== "undefined") {
      const audio = new Audio("/music/background.mp3")
      audio.loop = true
      audio.volume = 0.3
      audio.play().catch(() => {
        // Autoplay pode ser bloqueado, tudo bem
      })
      audioRef.current = audio
    }
  }

  // Pegar um prato da pilha
  const takePlate = () => {
    if (hasActivePlate || currentPlateIndex >= PHRASES.length) return
    setHasActivePlate(true)
  }

  // Completar prato atual
  const completePlate = () => {
    setShowingPhrase(true)
    setCurrentPhrase(PHRASES[currentPlateIndex])
  }

  // Avançar para próximo prato (quando clicar em "Pegar Prato Sujo")
  const nextPlate = () => {
    setCompletedPlates([...completedPlates, currentPlateIndex])
    setShowingPhrase(false)
    setHasActivePlate(false)

    const nextIndex = currentPlateIndex + 1
    setCurrentPlateIndex(nextIndex)

    // Verificar se acabou
    if (nextIndex >= PHRASES.length) {
      // Parar música
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setTimeout(() => setGameState("finished"), 500)
    }
  }

  // Reiniciar jogo
  const restartGame = () => {
    setGameState("start")
    setCurrentPlateIndex(0)
    setHasActivePlate(false)
    setCompletedPlates([])
    setShowingPhrase(false)
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  if (gameState === "start") {
    return <StartScreen onStart={startGame} />
  }

  if (gameState === "finished") {
    return <FinalScreen onRestart={restartGame} />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-blue-100 to-blue-200 p-3 pb-20">
      {/* Header com contador */}
      <header className="mb-4 text-center">
        <h1 className="mb-1 text-xl font-bold text-blue-900">
          Ter a pia
        </h1>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-md">
          <span className="text-xs text-gray-600">Pratos limpos:</span>
          <span className="text-base font-bold text-amber-600">
            {completedPlates.length}/{PHRASES.length}
          </span>
        </div>
      </header>

      {/* Área principal */}
      <main className="flex flex-1 flex-col items-center justify-center gap-4">

        {/* Instrução movida para o topo */}
        {!hasActivePlate && (
          <p className="px-4 text-center text-sm font-semibold text-blue-900 drop-shadow-sm">
            {remainingPlates > 0
              ? "Toque na pilha para pegar um prato"
              : "Todos os pratos foram lavados!"}
          </p>
        )}

        {/* Pia com imagem de fundo */}
        <div
          className="relative flex min-h-[320px] min-w-[320px] items-center justify-center overflow-hidden rounded-2xl shadow-xl"
          style={{
            backgroundImage: "url('/images/pia.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "24px",
          }}
        >

          {hasActivePlate && (
            showingPhrase ? (
              // Mostrar frase revelada com botao para proximo prato
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-64 w-64 flex-col items-center justify-center rounded-full border-8 border-amber-200 bg-white p-4 text-center shadow-xl">
                  <p className="text-sm font-medium leading-snug text-amber-800">{currentPhrase}</p>
                </div>
                <button
                  onClick={nextPlate}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-amber-950 shadow-md transition-transform active:scale-95"
                >
                  {remainingPlates > 1 ? "Pegar Prato Sujo" : "Ver Sentença"}
                </button>
              </div>
            ) : (
              // Prato para limpar
              <ScratchPlate
                phrase={PHRASES[currentPlateIndex]}
                onComplete={completePlate}
                plateNumber={currentPlateIndex + 1}
              />
            )
          )}
        </div>

        {/* Pilha de pratos */}
        {remainingPlates > 0 && (
          <PlatePile
            remainingPlates={remainingPlates}
            onTakePlate={takePlate}
            disabled={hasActivePlate}
          />
        )}
      </main>

      {/* Pratos completados (miniaturas) */}
      {completedPlates.length > 0 && (
        <div className="fixed bottom-3 left-3 right-3">
          <div className="flex flex-wrap justify-center gap-1.5">
            {completedPlates.map((plateIndex) => (
              <div
                key={plateIndex}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-md"
                title={PHRASES[plateIndex]}
              >
                {plateIndex + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
