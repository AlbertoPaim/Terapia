"use client"

interface PlatePileProps {
  remainingPlates: number
  onTakePlate: () => void
  disabled?: boolean
}

export function PlatePile({ remainingPlates, onTakePlate, disabled }: PlatePileProps) {
  if (remainingPlates === 0) return null
  
  return (
    <button
      onClick={onTakePlate}
      disabled={disabled}
      className="group relative flex flex-col items-center gap-1.5 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {/* Pilha de pratos */}
      <div className="relative h-14 w-24">
        {Array.from({ length: Math.min(remainingPlates, 5) }).map((_, index) => (
          <div
            key={index}
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-200 group-active:-translate-y-1"
            style={{
              bottom: `${index * 3}px`,
              zIndex: index,
            }}
          >
            {/* Prato individual */}
            <div
              className="h-3.5 w-20 rounded-full border-2 border-gray-300 bg-gradient-to-b from-white to-gray-100 shadow-md"
              style={{
                boxShadow: `0 ${2 + index}px ${4 + index * 2}px rgba(0,0,0,0.15)`,
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Contador */}
      <div className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-md">
        {remainingPlates} {remainingPlates === 1 ? "prato" : "pratos"}
      </div>
      
      {/* Instrução */}
      <p className="text-xs text-gray-500">Toque para pegar</p>
    </button>
  )
}
