import { memo, useMemo, forwardRef, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  Headphones, 
  FileText, 
  Users,
  Check,
  X,
  Bot,
  ShoppingCart,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { AnimatedList } from '@/components/ui/animated-list';
import { StaggerChars } from '@/components/ui/stagger-chars';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { useIsMobile } from '@/hooks/use-mobile';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';

// Circle component for animated beam visualization
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-10 sm:size-14 md:size-16 items-center justify-center rounded-xl sm:rounded-2xl border border-white/20 bg-zinc-900/80 p-2 sm:p-3 shadow-[0_0_30px_-12px_rgba(139,92,246,0.5)] backdrop-blur-sm",
          className
        )}
      >
        {children}
      </div>
      {label && (
        <span className="text-[8px] sm:text-[10px] md:text-xs text-white/50 text-center max-w-16 sm:max-w-20 leading-tight hidden sm:block">
          {label}
        </span>
      )}
    </div>
  );
});
Circle.displayName = "Circle";

// Icons for the visualization
const Icons = {
  pdf: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4C6 2.89543 6.89543 2 8 2H18L26 10V28C26 29.1046 25.1046 30 24 30H8C6.89543 30 6 29.1046 6 28V4Z" fill="#EF4444"/>
      <path d="M18 2L26 10H20C18.8954 10 18 9.10457 18 8V2Z" fill="#FCA5A5"/>
      <text x="16" y="22" fontSize="6" fill="white" textAnchor="middle" fontWeight="bold">PDF</text>
    </svg>
  ),
  excel: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4C6 2.89543 6.89543 2 8 2H18L26 10V28C26 29.1046 25.1046 30 24 30H8C6.89543 30 6 29.1046 6 28V4Z" fill="#22C55E"/>
      <path d="M18 2L26 10H20C18.8954 10 18 9.10457 18 8V2Z" fill="#86EFAC"/>
      <text x="16" y="22" fontSize="5" fill="white" textAnchor="middle" fontWeight="bold">XLS</text>
    </svg>
  ),
  drive: () => (
    <svg width="32" height="32" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  ),
  whatsapp: () => (
    <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#25D366" d="M24 4C12.95 4 4 12.95 4 24c0 3.53.92 6.84 2.54 9.72L4 44l10.58-2.77A19.9 19.9 0 0024 44c11.05 0 20-8.95 20-20S35.05 4 24 4z"/>
      <path fill="#fff" d="M34.5 28.5c-.5-.25-3-1.5-3.5-1.65-.5-.15-.85-.25-1.2.25s-1.4 1.65-1.7 2c-.3.35-.6.4-1.1.15-3-1.5-5-2.65-7-6-.5-.9.5-.85 1.5-2.8.15-.3.1-.55-.05-.8s-1.2-2.9-1.65-3.95c-.45-1.05-.9-.9-1.2-.9h-1c-.35 0-.9.15-1.35.65s-1.8 1.75-1.8 4.3 1.85 5 2.1 5.35c.25.35 3.6 5.55 8.75 7.75 3.25 1.4 4.5 1.5 6.15 1.25 1-.15 3-1.25 3.45-2.45.45-1.2.45-2.25.3-2.45-.15-.2-.5-.35-1-.6z"/>
    </svg>
  ),
  ai: () => (
    <div className="relative">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-blue-500 rounded-full blur-sm animate-pulse" />
      <Bot className="w-8 h-8 text-white relative z-10" />
    </div>
  ),
};

// "Como funciona" step item - Optimized with CSS animation
const HowItWorksItem = memo(({ emoji, step, title, description }: { 
  emoji?: string;
  step: number; 
  title: string; 
  description: string;
}) => (
  <div 
    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
  >
    <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl">
      {emoji}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
          Passo {step}
        </span>
      </div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-white/50">{description}</p>
    </div>
  </div>
));
HowItWorksItem.displayName = 'HowItWorksItem';

function RAGSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const excelRef = useRef<HTMLDivElement>(null);
  const driveRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !isMobile && !reducedMotion;

  const useCases = useMemo(() => [
    { icon: MessageSquare, title: "Atendimento ao cliente", description: "Respondendo políticas, prazos e dúvidas frequentes" },
    { icon: Headphones, title: "Suporte técnico", description: "Consultando manuais e resolvendo problemas" },
    { icon: FileText, title: "Equipe comercial", description: "Explicando contratos e condições" },
    { icon: Users, title: "Colaboradores internos", description: "Tirando dúvidas rápidas do dia a dia" },
    { icon: ShoppingCart, title: "E-commerce", description: "Informando sobre produtos e entregas" },
    { icon: Calendar, title: "Agendamentos", description: "Marcando reuniões e consultas" },
  ], []);

  return (
    <section id="rag" className="py-16 sm:py-24 md:py-40 relative overflow-hidden">
      {/* Background effects - simplified on mobile */}
      <div className="absolute inset-0">
        {isMobile ? (
          // Simplified background for mobile
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[60px]" />
        ) : (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] rounded-full bg-purple-500/5 blur-[100px] sm:blur-[150px]" />
            <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full bg-blue-500/5 blur-[80px] sm:blur-[120px]" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* ============================================= */}
        {/* HEADER - Hook Principal */}
        {/* ============================================= */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20 md:mb-32"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-10">
            <Brain className="w-4 h-4" />
            Inteligência que aprende com você
          </span>
          
          {/* Título principal com gradiente animado moderno */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight">
              <span className="relative inline-block">
                <span 
                  className="bg-linear-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent animate-gradient-x bg-size-[200%_auto]"
                  style={{ 
                    animation: 'gradient-shift 4s ease-in-out infinite',
                  }}
                >
                  Assistente Inteligente
                </span>
                {/* Glow effect */}
                <span 
                  className="absolute inset-0 bg-linear-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent blur-2xl opacity-40 -z-10"
                  aria-hidden="true"
                >
                  Agente de IA
                </span>
              </span>
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white/90 mt-3">
              treinado com os dados do seu negócio
            </p>
          </div>

          {/* Subheadline mais direta */}
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Diferente de um ChatGPT genérico, nosso assistente lê seus documentos e responde com informações reais do seu negócio. <br />
            <span className="text-white font-medium"> Sem inventar resposta: quando não encontra na base, encaminha para a sua equipe.</span>
          </p>
          
          {/* CSS para animação do gradiente - only render on desktop */}
          {!isMobile && (
            <style>{`
              @keyframes gradient-shift {
                0%, 100% { background-position: 0% center; }
                50% { background-position: 100% center; }
              }
            `}</style>
          )}
        </motion.div>

        {/* ============================================= */}
        {/* VISUALIZAÇÃO ANIMADA - Mockup de Interface */}
        {/* ============================================= */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.2 : 0.7, delay: isMobile ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 sm:mb-24 md:mb-36"
        >
          <div
            className="relative flex h-80 sm:h-[380px] md:h-[450px] w-full items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-sm p-4 sm:p-6 md:p-8"
            ref={containerRef}
          >
            <div className="flex size-full max-w-4xl flex-row items-stretch justify-between gap-3 sm:gap-4">
              
              {/* Lado Esquerdo - Arquivos */}
              <div className="flex flex-col justify-center gap-3 md:gap-4">
                <Circle ref={pdfRef} label="Tabela de Preços.pdf">
                  <Icons.pdf />
                </Circle>
                <Circle ref={excelRef} label="Planilha Clientes">
                  <Icons.excel />
                </Circle>
                <Circle ref={driveRef} label="Google Drive">
                  <Icons.drive />
                </Circle>
                <Circle ref={whatsappRef} label="WhatsApp Business">
                  <Icons.whatsapp />
                </Circle>
              </div>

              {/* Centro - IA */}
              <div className="flex flex-col justify-center">
                <Circle ref={aiRef} className="size-20 md:size-24 bg-linear-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                  <Icons.ai />
                </Circle>
              </div>

              {/* Lado Direito - Chat */}
              <div className="flex flex-col justify-center py-2 z-10">
                <div ref={chatRef} className="relative">
                  {/* Chat Window Mockup */}
                  <div className="w-[120px] sm:w-[180px] md:w-[260px] rounded-lg sm:rounded-2xl border border-white/20 bg-zinc-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                    {/* Chat Header */}
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 border-b border-white/10 bg-zinc-800/50">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[9px] sm:text-xs text-white/70 font-medium">Assistente IA</span>
                      </div>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg rounded-tr-sm px-2 sm:px-3 py-1.5 sm:py-2 max-w-[90%]">
                          <p className="text-[8px] sm:text-[10px] md:text-xs text-white/90">
                            Qual o desconto para o produto X?
                          </p>
                        </div>
                      </div>
                      
                      {/* AI Response */}
                      <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 rounded-lg rounded-tl-sm px-2 sm:px-3 py-1.5 sm:py-2 max-w-[95%]">
                          <p className="text-[8px] sm:text-[10px] md:text-xs text-white/80 leading-relaxed">
                            <span className="hidden sm:inline">Conforme documentação da </span>
                            <span className="text-purple-400 font-medium">política comercial</span><span className="hidden sm:inline"> (pág. 4)</span>, 
                            desconto de <span className="text-green-400 font-bold">10%</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Beams - Now visible on all devices for better experience */}
            <>
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={pdfRef}
                toRef={aiRef}
                gradientStartColor="#ef4444"
                gradientStopColor="#8b5cf6"
                duration={4}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={excelRef}
                toRef={aiRef}
                gradientStartColor="#22c55e"
                gradientStopColor="#8b5cf6"
                duration={5}
                delay={0.5}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={driveRef}
                toRef={aiRef}
                gradientStartColor="#3b82f6"
                gradientStopColor="#8b5cf6"
                duration={4.5}
                delay={1}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={whatsappRef}
                toRef={aiRef}
                gradientStartColor="#25D366"
                gradientStopColor="#8b5cf6"
                duration={5.5}
                delay={1.5}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={aiRef}
                toRef={chatRef}
                gradientStartColor="#8b5cf6"
                gradientStopColor="#06b6d4"
                duration={3}
                delay={2}
              />
            </>
          </div>

          {/* Legenda explicativa */}
          <p className="text-center text-white/40 text-sm mt-4">
            Seus documentos → Agente de IA → Respostas com a fonte citada
          </p>
        </motion.div>

        {/* ============================================= */}
        {/* COMPARAÇÃO: Antes vs Depois */}
        {/* ============================================= */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 md:mb-36"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
            Antes <span className="text-white/40">vs</span> Depois
          </h3>
          <p className="text-white/50 text-sm sm:text-base text-center mb-8 sm:mb-12 max-w-lg mx-auto px-2">
            Veja a diferença entre uma IA comum e uma que conhece seu negócio de verdade.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* IA Genérica */}
            <div className="group relative p-5 md:p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-red-500/20 transition-all duration-300">
              {/* Header compacto */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white/80">IA Genérica</h4>
                  <p className="text-xs text-white/40">ChatGPT, Gemini...</p>
                </div>
              </div>
              
              {/* Exemplo único mais impactante */}
              <div className="bg-black/30 rounded-xl p-4 mb-5 border border-white/5">
                <p className="text-white/50 text-xs mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                  Cliente pergunta sobre preço
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  "Não tenho acesso aos seus dados de preços. Recomendo verificar diretamente no site..."
                </p>
              </div>
              
              {/* Lista de problemas */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-white/50">
                  <X className="w-3.5 h-3.5 text-red-400/70 shrink-0" />
                  <span>Desconhece seu negócio</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/50">
                  <X className="w-3.5 h-3.5 text-red-400/70 shrink-0" />
                  <span>Pode inventar informações</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/50">
                  <X className="w-3.5 h-3.5 text-red-400/70 shrink-0" />
                  <span>Respostas vagas e genéricas</span>
                </div>
              </div>
            </div>

            {/* IA Personalizada */}
            <div className="group relative p-5 md:p-6 rounded-2xl bg-zinc-900/40 border border-purple-500/20 shadow-[0_0_30px_-15px_rgba(168,85,247,0.3)]">
              {/* Badge destaque */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 text-xs font-medium bg-linear-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg">
                  Recomendado
                </span>
              </div>
              
              {/* Header compacto */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-purple-500/10">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Sua IA Personalizada</h4>
                  <p className="text-xs text-purple-400/70">Treinada com seus dados</p>
                </div>
              </div>
              
              {/* Exemplo único mais impactante */}
              <div className="bg-purple-500/5 rounded-xl p-4 mb-5 border border-purple-500/10">
                <p className="text-white/50 text-xs mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Mesma pergunta
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  "O plano Pro custa <span className="text-emerald-400 font-semibold">R$ 197/mês</span>. 
                  <span className="text-purple-400/80"> <br />Fonte: Tabela de Preços 2026</span>"
                </p>
              </div>
              
              {/* Lista de benefícios */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-white/70">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Consulta os documentos que você enviar</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/70">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Cita a fonte da informação</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/70">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Passa para humano quando não sabe</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================= */}
        {/* COMO FUNCIONA - AnimatedList */}
        {/* ============================================= */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 md:mb-36"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-5">
            Como <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">funciona</span>
          </h3>
          <p className="text-white/50 text-sm sm:text-base text-center mb-8 sm:mb-12 max-w-md mx-auto px-2">
            3 passos simples para ter um assistente que responde com base nos documentos do seu negócio.
          </p>

          <div className="max-w-xl mx-auto min-h-96 overflow-hidden pb-8">
            <AnimatedList delay={2000} holdDelay={6000} loop={true}>
              <HowItWorksItem
                emoji="📂"
                step={1}
                title="Conecte seus dados"
                description="PDFs, planilhas, contratos, site."
              />
              <HowItWorksItem
                emoji="🧠"
                step={2}
                title="A IA aprende"
                description="Organiza o conteúdo e aprende com cada documento novo que você adicionar."
              />
              <HowItWorksItem
                emoji="💬"
                step={3}
                title="Responde citando a fonte"
                description="Em segundos. Quando não encontra na base, encaminha para a sua equipe."
              />
            </AnimatedList>
          </div>
        </motion.div>

        {/* ============================================= */}
        {/* EXEMPLOS REAIS DE USO */}
        {/* ============================================= */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8"
        >
          <div className="text-center mb-14">
            <StaggerChars
              text="Casos de Uso"
              className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-purple-400"
              hoverText="Onde Usar"
              hoverClassName="text-pink-400"
              direction="alternate"
            />
            <p className="text-white/50 mt-8 max-w-xl mx-auto">
              Onde um agente que conhece os documentos do seu negócio ajuda no dia a dia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: shouldAnimate ? index * 0.08 : 0, duration: isMobile ? 0.15 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <SpotlightCard 
                  className="h-full p-6"
                  spotlightColor="139, 92, 246"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                      <useCase.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{useCase.title}</h4>
                      <p className="text-sm text-white/50">{useCase.description}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default memo(RAGSection);
