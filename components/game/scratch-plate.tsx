"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface ScratchPlateProps {
  phrase: string
  onComplete: () => void
  plateNumber: number
}

export function ScratchPlate({ phrase, onComplete, plateNumber }: ScratchPlateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [percentCleared, setPercentCleared] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)
  const hasCompletedRef = useRef(false)

  // Tamanho responsivo: menor em mobile
  const plateSize = typeof window !== "undefined" && window.innerWidth < 400 ? 220 : 260

  // Calcular porcentagem limpa
  const calculatePercentCleared = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return 0

    const ctx = canvas.getContext("2d")
    if (!ctx) return 0

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let clearedPixels = 0

    // Contar pixels transparentes (alpha < 128)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        clearedPixels++
      }
    }

    const totalPixels = canvas.width * canvas.height
    return (clearedPixels / totalPixels) * 100
  }, [])

  // Inicializar canvas com "sujeira"
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Criar padrão de sujeira
    ctx.fillStyle = "#8B7355"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Adicionar manchas variadas
    const colors = ["#6B4423", "#A0522D", "#8B4513", "#D2691E", "#CD853F"]
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      ctx.beginPath()
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 30 + 10,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }
  }, [])

  // Função para "limpar" onde o dedo passa
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    // Brush maior para toque em mobile (dedo é maior que mouse)
    ctx.arc(x, y, 35, 0, Math.PI * 2)
    ctx.fill()

    // Calcular porcentagem
    const percent = calculatePercentCleared()
    setPercentCleared(percent)

    // Se 80% limpo, completar automaticamente
    if (percent >= 80 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      setIsRevealed(true)

      // Limpar canvas completamente
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Tocar som de "plim" ou limpeza
      const audio = new Audio("/sounds/limpar_prato.mp3")
      audio.play().catch(() => { })

      setTimeout(onComplete, 800)
    }
  }, [calculatePercentCleared, onComplete])

  // Handlers de mouse/touch
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return
    setIsScratching(true)
    const { x, y } = getCoordinates(e)
    scratch(x, y)
    setCursorPos({ x, y })
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(e)
    setCursorPos({ x, y })

    if (!isScratching || isRevealed) return
    scratch(x, y)
  }

  const handleEnd = () => {
    setIsScratching(false)
  }

  const handleLeave = () => {
    setIsScratching(false)
    setCursorPos(null)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Prato */}
      <div className="relative">
        {/* Borda do prato */}
        <div
          className="rounded-full bg-gradient-to-b from-gray-200 to-gray-300 p-3 shadow-xl"
          style={{ width: plateSize + 24, height: plateSize + 24 }}
        >
          {/* Interior do prato */}
          <div
            className="relative overflow-hidden rounded-full bg-white shadow-inner"
            style={{ width: plateSize, height: plateSize, cursor: "none" }}
            onMouseEnter={(e) => {
              const { x, y } = getCoordinates(e)
              setCursorPos({ x, y })
            }}
            onMouseLeave={handleLeave}
            onMouseMove={handleMove}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            {/* Frase escondida */}
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <p
                className={`text-sm font-medium leading-snug text-amber-800 transition-opacity duration-500 ${isRevealed ? "opacity-100" : "opacity-0 invisible"
                  }`}
              >
                {phrase}
              </p>
            </div>

            {/* Canvas de sujeira */}
            <canvas
              ref={canvasRef}
              width={plateSize}
              height={plateSize}
              style={{ touchAction: "none" }}
              className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isRevealed ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
            />

            {/* Custom Sponge Cursor Element */}
            {!isRevealed && cursorPos && (
              <div
                className="pointer-events-none absolute z-50 transition-transform duration-75"
                style={{
                  left: cursorPos.x,
                  top: cursorPos.y,
                  transform: 'translate(-50%, -50%)',
                  width: '64px',
                  height: '64px',
                  backgroundImage: "url('/images/sponge-cursor.png')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            )}
          </div>
        </div>

        {/* Número do prato */}
        <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-amber-950 shadow-lg">
          {plateNumber}
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="w-56">
        <div className="mb-1 flex justify-between text-sm text-gray-600">
          <span>Limpeza</span>
          <span>{Math.round(percentCleared)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
            style={{ width: `${percentCleared}%` }}
          />
        </div>
      </div>

      {/* Instrução */}
      {!isRevealed && (
        <p className="px-4 text-center text-xs text-gray-500">
          Passe o dedo para limpar o prato!
        </p>
      )}
    </div>
  )
}
