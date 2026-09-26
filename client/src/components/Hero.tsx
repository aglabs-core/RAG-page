import { Suspense, lazy, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHighPerfWebGL } from "@/hooks/use-high-perf";
import { useAfterLoad } from "@/hooks/use-after-load";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
const LightPillar = lazy(() => import("@/components/ui/light-pillar"));
const Globe = lazy(() => import("@/components/ui/globe").then((m) => ({ default: m.Globe })));
import { RainbowButton } from "@/components/ui/rainbow-button";
import { HyperText } from "@/components/ui/hyper-text";
import { StatsCount } from "@/components/ui/stats-count";
import { useChatbot } from "@/components/ChatbotContext";

// Simple wrapper component for no-animation scenarios
const StaticDiv = memo(({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
));
StaticDiv.displayName = "StaticDiv";

const WHATSAPP_LINK = "https://wa.me/5564993259857?text=Quero%20saber%20mais%20sobre%20o%20Agente%20RAG...";

// Memoized static SVG globe for low-end mobile devices
const SVGGlobeFallback = memo(() => (
  <div className="absolute right-[-10%] top-[45%] w-64 h-64 pointer-events-none mobile-globe opacity-25" aria-hidden>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="#6b21a8" />
          <stop offset="1" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#g1)" strokeWidth="1.5" className="animate-spin-slow">
        <circle cx="50" cy="50" r="22" opacity="0.95" />
        <ellipse cx="50" cy="50" rx="28" ry="10" transform="rotate(20 50 50)" opacity="0.8" />
        <ellipse cx="50" cy="50" rx="28" ry="10" transform="rotate(-20 50 50)" opacity="0.6" />
      </g>
    </svg>
  </div>
));
SVGGlobeFallback.displayName = "SVGGlobeFallback";

// Memoized CSS pillar fallback
const CSSPillarFallback = memo(() => (
  <div className="absolute inset-0 mobile-pillar-bg">
    <div className="absolute inset-0 bg-black/28" />
  </div>
));
CSSPillarFallback.displayName = "CSSPillarFallback";

// Stats data - defined outside component to avoid recreation
const stats = [
  { value: 40, suffix: "h+", label: "Economizadas/mês" },
  { value: 99, suffix: "%", label: "Precisão" },
  { value: 24, suffix: "/7", label: "Disponível" },
];

// LightPillar config - memoized to prevent re-renders
const desktopPillarConfig = {
  topColor: "#2d1f6b",
  bottomColor: "#4a3259",
  intensity: 0.5,
  rotationSpeed: 0.1,
  glowAmount: 0.01,
  pillarWidth: 6.0,
  pillarHeight: 0.25,
  noiseIntensity: 0.5,
  mixBlendMode: "screen",
  pillarRotation: 55,
} as const;

const mobilePillarConfig = {
  topColor: "#2d1f6b",
  bottomColor: "#4a3259",
  intensity: 0.45,
  rotationSpeed: 0.08,
  glowAmount: 0.008,
  pillarWidth: 5.5,
  pillarHeight: 0.25,
  noiseIntensity: 0.45,
  mixBlendMode: "screen",
  pillarRotation: 55,
} as const;

function Hero() {
  const { openChat } = useChatbot();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const effectsReady = useAfterLoad();
  const isHighPerf = useHighPerfWebGL(effectsReady);
  
  // Determine if we should skip animations entirely
  const skipAnimations = isMobile || reducedMotion;
  
  // Memoized animation config - prevents object recreation
  const fadeInUp = useMemo(() => ({
    initial: skipAnimations ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: skipAnimations ? 0 : 0.6 }
  }), [skipAnimations]);
  
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Light Pillar Background - Only on desktop for performance */}
      {!isMobile && effectsReady && (
        <Suspense fallback={null}>
          <LightPillar {...desktopPillarConfig} />
        </Suspense>
      )}

      {/* Mobile pillar/globe — use WebGL effects on capable devices; otherwise show lightweight CSS fallback */}
      {isMobile && (
        <>
          {isHighPerf && effectsReady ? (
            <>
              {/* WebGL LightPillar (lazy) */}
              <Suspense fallback={null}>
                <LightPillar {...mobilePillarConfig} />
              </Suspense>

              {/* Animated globe (lazy) positioned for mobile - moved down-right with transparency */}
              <div className="absolute right-[-30%] top-[30%] w-100 h-100 sm:w-96 sm:h-96 z-10 pointer-events-none opacity-30" aria-hidden>
                <div className="absolute inset-0 bg-purple-500/15 blur-[80px] rounded-full" />
                <Suspense fallback={null}>
                  <Globe className="w-full h-full" />
                </Suspense>
              </div>
            </>
          ) : (
            <>
              {/* CSS pillar fallback to preserve visual identity */}
              <CSSPillarFallback />
              {/* SVG globe fallback (lightweight) - centralizado no topo */}
              <SVGGlobeFallback />
            </>
          )}
        </>
      )}

      <div className="relative z-10 px-4 md:px-6 mx-auto max-w-none w-full h-full flex items-center overflow-visible py-16 sm:py-20 pb-24 landscape:pb-32 sm:landscape:pb-20">
        <div className="grid w-full xl:grid-cols-2 gap-8 xl:gap-12 items-center overflow-visible">
          {/* Left Column - Content (shows first on mobile) */}
          <div className="relative order-1 text-center xl:text-left">
            {/* Badge - use CSS animations only */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white/80 backdrop-blur-xl mb-6 animate-fade-in-up"
              style={{ animationDelay: '0ms', animationDuration: skipAnimations ? '0ms' : '600ms' }}
            >
              <span className="relative flex h-2 w-2">
                {/* Disable ping animation on mobile */}
                {!skipAnimations && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Agência de IA em Rio Verde
            </div>

            {/* Main Headline - SEO optimized with HyperText effect */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-display font-bold leading-[1.1] tracking-tight mb-4 sm:mb-6 animate-fade-in-up"
              style={{ animationDelay: skipAnimations ? '0ms' : '100ms', animationDuration: skipAnimations ? '0ms' : '800ms' }}
            >
              <span className="text-white">Automatize seu negócio com</span>
              <br />
              <HyperText className="bg-linear-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                AGENTES DE IA
              </HyperText>
            </h1>

            {/* Subtitle - Improved copy */}
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 leading-relaxed max-w-xl mx-auto xl:mx-0 mb-6 sm:mb-8 px-2 sm:px-0 animate-fade-in-up"
              style={{ animationDelay: skipAnimations ? '0ms' : '200ms', animationDuration: skipAnimations ? '0ms' : '800ms' }}
            >
              Criamos funcionários digitais. Agentes que leem seus documentos e <strong className="text-white">reduzem 80% do trabalho manual</strong>. Atendimento 24/7, zero erros, escala infinita.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-10 px-2 sm:px-0 animate-fade-in-up"
              style={{ animationDelay: skipAnimations ? '0ms' : '300ms', animationDuration: skipAnimations ? '0ms' : '800ms' }}
            >
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <RainbowButton className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base w-full">
                  <Sparkles className="w-4 h-4" />
                  Diagnóstico Gratuito
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </RainbowButton>
              </a>

              <button
                onClick={openChat}
                className="group h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium rounded-lg border border-white/20 hover:border-purple-500/50 bg-white/5 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 sm:hover:scale-105"
              >
                Teste a Eficiência Agora
              </button>
            </div>

            {/* Stats with animated counter */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: skipAnimations ? '0ms' : '400ms', animationDuration: skipAnimations ? '0ms' : '800ms' }}
            >
              <StatsCount stats={stats} showDividers={true} />
            </div>
          </div>
    
          {/* Right Column - Globe (desktop only - not rendered on mobile) */}
          {!isMobile && effectsReady && (
            <motion.div
              className="relative order-2 mt-8 xl:mt-0 hidden xl:flex items-center justify-center overflow-visible"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative w-full max-w-[1400px] aspect-square flex items-center justify-center overflow-visible translate-x-16 translate-y-48 scale-[1.5]">
                {/* Glow effect behind globe */}
                <div className="absolute inset-0 bg-purple-500/10 blur-[120px] rounded-full scale-150" />
                <Suspense fallback={null}>
                  <Globe className="relative z-10 w-full h-full" />
                </Suspense>
              </div>
            </motion.div>
          )}

          {/* Small decorative globe for medium screens (tablet) - positioned behind content like mobile */}
          {!isMobile && effectsReady && (
            <div className="absolute right-[-20%] top-[30%] w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] z-0 pointer-events-none opacity-25 xl:hidden" aria-hidden>
              <div className="absolute inset-0 bg-purple-500/15 blur-[100px] rounded-full" />
              <Suspense fallback={null}>
                <Globe className="w-full h-full" />
              </Suspense>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator - desktop only */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5"
            animate={reducedMotion ? {} : { y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: reducedMotion ? 0 : Infinity }}
          >
            <motion.div className="w-1 h-1 rounded-full bg-white/50" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(Hero);
