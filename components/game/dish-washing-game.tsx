"use client"

import { useState, useRef, useEffect } from "react"
import { StartScreen } from "./start-screen"
import { PlatePile } from "./plate-pile"
import { ScratchPlate } from "./scratch-plate"
import { FinalScreen } from "./final-screen"

const ALL_PHRASES = [
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
  "Mandado de Segurança: Para proteger o meu coração que você roubou irreversivelmente.",
  "Dano Moral: O que eu sofro de saudade quando você passa o dia todo trabalhando.",
  "Audiência de Conciliação: Vamos decidir quem ama mais? Eu ganho por decurso de prazo.",
  "Ônus da Prova: Você não precisa provar nada, seu sorriso já é a evidência perfeita.",
  "Revelia: Meu coração se entregou para você sem nem apresentar defesa.",
  "Tutela Antecipada: Quero você aqui do meu lado agora mesmo, Excelência!",
  "Citação Eletrônica: Receba esta notificação oficial de que você é o amor da minha vida.",
  "Diligência: Fui verificar e confirmo que você fica mais linda a cada dia que passa.",
  "Pensão Alimentícia: Aceito ser pago exclusivamente com jantares românticos e carinho.",
  "Agravo de Instrumento: Recorro dessa sua mania de ser tão perfeita o tempo todo.",
  "Fórum Competente: O único lugar adequado para julgar esse caso é o nosso quarto.",
  "Voto do Relator: Acompanho o relator e declaro que nosso amor é inconstitucional de tão grande.",
  "Vício de Consentimento: Fui coagido pela sua beleza a me apaixonar perdidamente.",
  "Prescrição: O meu amor por você jamais prescreverá, nem em mil anos.",
  "Recurso Extraordinário: Extraordinário mesmo é a sorte que eu tive de encontrar você.",
  "Despacho Saneador: Fica determinado que hoje à noite tem vinho e filme romântico.",
  "Carga dos Autos: Levei o processo pra casa, e de quebra, o meu coração ficou com você.",
  "Fatos Incontroversos: O seu abraço é o melhor lugar do mundo, não cabe recurso.",
  "Princípio da Boa-fé: Confiei cegamente no seu sorriso e olha no que deu: paixão total.",
  "Testemunha Ocular: O espelho pode provar que você está deslumbrante hoje, meu amor.",
  "Penhora On-line: Você bloqueou todos os meus pensamentos com esse seu jeitinho.",
  "Usucapião: Você morou tanto tempo na minha cabeça que agora é dona do meu coração.",
  "Direito de Preferência: Entre qualquer coisa no universo, eu exerço o direito de escolher você.",
  "Reconvenção: Você achou que tinha me conquistado, mas eu que conquistei você em dobro.",
  "Cláusula Pétrea: Nosso relacionamento não pode sofrer emendas, já é perfeito assim.",
  "Atentado ao Pudor: O crime perfeito foi você ter roubado minha atenção toda pra si.",
  "Justa Causa: Fui demitido da vida de solteiro com justa causa, por me apaixonar por você.",
  "Despejo: Notificação para retirar qualquer tristeza do seu coração imediatamente.",
  "Legítima Defesa: Só me apaixonei rápido assim para me defender de uma vida sem você.",
  "Bens Inalienáveis: Seu sorriso, seu abraço e seu carinho são meus bens mais valiosos.",
  "Lucros Cessantes: O que eu deixo de ganhar em felicidade a cada segundo longe de você.",
  "Falso Testemunho: Quem disser que não somos o casal perfeito está cometendo crime.",
  "Litigância de Má-fé: Agiu com malícia quando deu aquele sorriso que me desmontou.",
  "Prazo Peremptório: Você tem exatos 5 segundos para me dar um beijo. Valendo!",
  "Intimação: Compareça imediatamente nos meus braços para abraço inadiável.",
  "Amicus Curiae: Até os nossos amigos sabem que fomos feitos um para o outro.",
  "Excludente de Ilicitude: Não há crime em te amar enlouquecidamente, é legítima necessidade.",
  "Súmula Vinculante: A partir de hoje, é regra que nós nos amemos cada vez mais.",
  "Decadência: Não decai em nada a sua beleza com o passar dos anos.",
  "Segredo de Justiça: O que a gente faz entre quatro paredes fica só nos autos do nosso amor.",
  "Medida Cautelar: Te abraçar forte para evitar o perigo de você sentir frio.",
  "Precatório: Meu amor renderia uma dívida que nem o Estado conseguiria te pagar.",
  "Honorários Sucumbenciais: O prêmio que ganhei no final do processo da vida foi você.",
  "Recurso Adesivo: Você grudou em mim de um jeito que a gente nunca mais se solta.",
  "Substabelecimento: Não aceito intermediários, faço questão de te amar pessoalmente.",
  "Jurisdição Universal: Você manda no meu coração em qualquer lugar do planeta Terra.",
  "Indulto: Hoje você está perdoada de lavar a louça, o juiz (eu) decretou descanso.",
  "Vacatio Legis: O tempo que a gente perdeu antes de se conhecer oficialmente.",
  "Sustentação Oral: Eu passaria horas no tribunal elogiando cada detalhe seu.",
  "Petição Inepta: Qualquer palavra minha tentando descrever sua perfeição será insuficiente.",
  "Impedimento: Estou impedido de olhar para outras pessoas depois que te conheci.",
  "Caso Fortuito: O acaso mais maravilhoso da minha vida foi esbarrar com você.",
  "Força Maior: Uma força maior me puxa para você toda vez que estamos no mesmo ambiente.",
  "Direitos Autorais: Deus caprichou nos direitos autorais quando criou uma obra de arte feito você.",
  "Defensoria Pública: Eu defenderia seu sorriso contra o mundo inteiro, sem cobrar nada.",
  "Bens Móveis: De tanto pensar em você, meu cérebro já entrou no inventário dos seus bens.",
  "Rescisão Contratual: Fim de contrato com qualquer dia triste, a partir de hoje é só alegria.",
  "Embargos à Execução: Quero embargar essa sua pressa de ir embora toda manhã.",
  "Litisconsórcio Ativo: Nós dois juntos somos a equipe mais imbatível do tribunal da vida.",
  "Crime Culposo: Esbarrei em você sem querer, mas me apaixonei de propósito.",
  "Crime Doloso: Assumo o dolo de te fazer a mulher mais feliz da face da terra.",
  "Afastamento Preventivo: Estou afastado das noitadas porque a melhor festa é com você em casa.",
  "Hasteamento da Bandeira: Declaro rendição total ao seu beijo de bom dia.",
  "Salário-Maternidade: A nossa família merece o maior salário de felicidade do universo.",
  "Audiência de Custódia: Fui preso no seu abraço e decidi que não quero mais sair.",
  "Recolhimento de Custas: Já paguei todas as taxas necessárias para ser feliz ao seu lado.",
  "Perdas e Danos: O tempo que passei solteiro vou cobrar em beijos de agora em diante.",
  "Contrato de Risco: Namorar comigo é um risco, você pode morrer, mas é de tanto rir.",
  "Foro Privilegiado: Nosso amor tem privilégios e está acima de qualquer tribunal comum.",
  "Direitos Reais: É real que eu acordo todo dia pensando em como te fazer sorrir.",
  "Comunhão Universal: O que é seu, é meu. E o que é meu, já é todo seu faz tempo.",
  "Herança Jacente: Não quero deixar herança, quero gastar tudo vivendo aventuras com você.",
  "Contrato de Adesão: Assinei embaixo de todas as suas manias porque te amo com elas.",
  "Abuso de Poder: O poder que você tem sobre mim com apenas um olhar chega a ser ilegal.",
  "Quebra de Sigilo: Quebro todos os meus segredos para você, porque não escondo o quanto te amo.",
  "Reintegração de Posse: Venha tomar posse do que é seu: a outra metade da minha cama.",
  "Trâmite Expresso: Com você, a felicidade chega sem burocracia e em tempo recorde.",
  "Acordo Extrajudicial: Vamos fazer um acordo... você me ama e eu te mimo pra sempre.",
  "Certidão Cível Positiva: Positivamente apaixonado pelo seu cheiro maravilhoso.",
  "Veto Presidencial: Estão vetadas as brigas bobas, nossa lei agora é só carinho.",
  "Impeachment: Decretei o impeachment da tristeza na nossa casa, a partir de agora governa o amor.",
  "Efeito Suspensivo: Quando você me olha, o mundo entra em suspensão e só você existe.",
  "Contestação: Eu contesto qualquer pessoa que diga que conto de fadas não existe.",
  "Interrogatório: Por que você insiste em ficar mais sedutora a cada ano que passa?",
  "Acareação: Vou ter que botar meus olhos frente a frente com os seus para resolver esse assunto.",
  "Acordo de Leniência: Confesso! Sou inteiramente culpado de ser viciado no seu cafuné.",
  "Concessão de Serviço: Concedo a você o serviço exclusivo de mandar no meu coração.",
  "Inadimplência: Eu estou eternamente em dívida por ser a pessoa que mais ganha no nosso abraço.",
  "Fiança Arbitrada: Nenhum valor no mundo pagaria a fiança para me soltar do seu laço.",
  "Decreto Legislativo: Fica decretado, com força de lei, que nosso amor é matéria inegociável."
]

type GameState = "start" | "playing" | "finished"

export function DishWashingGame() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0)
  const [hasActivePlate, setHasActivePlate] = useState(false)
  const [completedPlates, setCompletedPlates] = useState<number[]>([])
  const [showingPhrase, setShowingPhrase] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState("")
  const [gamePhrases, setGamePhrases] = useState<string[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const remainingPlates = gamePhrases.length - currentPlateIndex

  // Iniciar música de fundo e sortear as 10 frases aleatórias
  const startGame = () => {
    // Pegar 10 frases aleatorias diferentes
    const shuffled = [...ALL_PHRASES].sort(() => 0.5 - Math.random())
    const selectedPhrases = shuffled.slice(0, 10)
    setGamePhrases(selectedPhrases)

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
    if (hasActivePlate || currentPlateIndex >= gamePhrases.length) return
    setHasActivePlate(true)
  }

  // Completar prato atual
  const completePlate = () => {
    setShowingPhrase(true)
    setCurrentPhrase(gamePhrases[currentPlateIndex])
  }

  // Avançar para próximo prato (quando clicar em "Pegar Prato Sujo")
  const nextPlate = () => {
    setCompletedPlates([...completedPlates, currentPlateIndex])
    setShowingPhrase(false)
    setHasActivePlate(false)

    const nextIndex = currentPlateIndex + 1
    setCurrentPlateIndex(nextIndex)

    // Verificar se acabou
    if (nextIndex >= gamePhrases.length) {
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
            {completedPlates.length}/{gamePhrases.length}
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
                phrase={gamePhrases[currentPlateIndex]}
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
                title={gamePhrases[plateIndex]}
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
