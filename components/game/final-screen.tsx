"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Gift, Download, Heart } from "lucide-react"
import confetti from "canvas-confetti"

interface FinalScreenProps {
  onRestart: () => void
}

export function FinalScreen({ onRestart }: FinalScreenProps) {
  const [showCoupon, setShowCoupon] = useState(false)
  const couponRef = useRef<HTMLDivElement>(null)
  
  // Lançar confetes ao entrar
  useEffect(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    
    const randomInRange = (min: number, max: number) => 
      Math.random() * (max - min) + min
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      
      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#FF69B4", "#87CEEB"],
      })
    }, 250)
    
    return () => clearInterval(interval)
  }, [])
  
  const handleDownloadCoupon = () => {
    // Criar imagem do cupom
    const coupon = couponRef.current
    if (!coupon) return
    
    // Usar html2canvas ou simplesmente abrir para impressão
    window.print()
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 to-amber-100 p-3">
      <div className="mx-auto max-w-md">
        {/* Capa do Processo */}
        <div className="mb-8 overflow-hidden rounded-lg border-4 border-amber-700 bg-white shadow-2xl">
          {/* Cabeçalho */}
          <div className="border-b-2 border-amber-700 bg-amber-800 p-4 text-center text-white">
            <div className="mb-1.5 text-xs font-medium tracking-wider">
              TRIBUNAL DE JUSTIÇA DO CORAÇÃO
            </div>
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 fill-red-400 text-red-400" />
              <span className="text-lg font-bold">SENTENÇA DE MÉRITO</span>
              <Heart className="h-5 w-5 fill-red-400 text-red-400" />
            </div>
          </div>
          
          {/* Corpo */}
          <div className="space-y-4 p-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">PROCESSO N°</p>
              <p className="text-xl font-bold text-amber-800">08/03/2026</p>
            </div>
            
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="mb-1 text-xs font-semibold text-amber-800">
                PARTES:
              </p>
              <p className="text-sm text-gray-700">
                <strong>Autor:</strong> Alberto Paim
              </p>
              <p className="text-sm text-gray-700">
                <strong>Ré:</strong> Luana Paim
              </p>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700">
              <p className="leading-relaxed">
                <strong className="text-amber-800">VEREDITO:</strong> Após analisar 
                cuidadosamente as provas (os 10 pratos limpos), este magistrado decide:
              </p>
              
              <p className="rounded-lg bg-amber-100 p-3 text-center text-base font-medium text-amber-900">
                A ré <strong>Luana Paim</strong> faz jus a uma <strong>INDENIZAÇÃO 
                POR DANOS DE CANSAÇO</strong>, a ser paga imediatamente pelo autor.
              </p>
              
              <p className="text-xs text-gray-500">
                Sem possibilidade de recurso. Decisão irrevogável.
              </p>
            </div>
            
            {/* Assinatura */}
            <div className="border-t pt-4 text-center">
              <div className="mx-auto mb-1.5 w-40 border-b border-gray-400" />
              <p className="text-sm font-semibold text-amber-800">Juiz Alberto Paim</p>
              <p className="text-xs text-gray-500">
                Juiz de Direito da Vara do Coração
              </p>
            </div>
          </div>
        </div>
        
        {/* Botão do Cupom */}
        {!showCoupon ? (
          <div className="py-4 text-center">
            <Button
              onClick={() => setShowCoupon(true)}
              size="lg"
              className="animate-pulse bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 text-base text-white shadow-lg transition-all active:scale-95"
            >
              <Gift className="mr-2 h-5 w-5" />
              Revelar Recompensa
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Cupom */}
            <div
              ref={couponRef}
              className="relative overflow-hidden rounded-xl border-4 border-dashed border-amber-500 bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-400 p-5 text-center shadow-2xl print:border-solid"
            >
              {/* Decoração */}
              <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-amber-100" />
              <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-amber-100" />
              
              <div className="mb-1.5 text-xs font-bold tracking-widest text-amber-800">
                CUPOM MÁGICO
              </div>
              
              <div className="mb-2 text-2xl font-black text-amber-900">
                VALE-MASSAGEM
              </div>
              
              <div className="mb-3 text-base font-semibold text-amber-800">
                SEM RECLAMAÇÃO
              </div>
              
              <div className="mb-3 rounded-lg bg-white/50 p-2.5 text-xs text-amber-900">
                Válido por tempo indeterminado. Resgatável a qualquer momento. 
                O portador tem direito a uma massagem completa, com carinho e dedicação.
              </div>
              
              <div className="text-xs text-amber-700">
                Emitido com amor por Alberto Paim
              </div>
            </div>
            
            {/* Botões */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={handleDownloadCoupon}
                variant="outline"
                className="border-amber-500 text-amber-700 hover:bg-amber-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Imprimir Cupom
              </Button>
              
              <Button
                onClick={onRestart}
                variant="outline"
                className="border-gray-300 text-gray-600"
              >
                Jogar Novamente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
