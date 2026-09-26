import { Suspense, lazy, memo, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Bot, Globe, Layers, Zap, ArrowRight, Check, Sparkles, TrendingUp, Clock, Shield, MessageSquare, Brain, Cpu, Database, Workflow, Code2 } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const ServicesBackground = lazy(() => import("./ServicesBackground"));

const WHATSAPP_LINK = "https://wa.me/5564993259857?text=Quero%20saber%20mais%20sobre%20os%20serviços...";

const services = [
  {
    icon: Bot,
    title: "Agentes de IA",
    subtitle: "Funcionários Digitais 24/7",
    description: "Agentes inteligentes que entendem seus documentos, respondem clientes e automatizam processos complexos.",
    features: ["Responde em segundos", "Integração com WhatsApp", "Aprende com sua base"],
    metrics: { value: "24h", label: "no site e WhatsApp" },
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glowColor: "purple",
    spotlightColor: "168, 85, 247",
    accentColor: "bg-purple-500/20",
    iconBg: "bg-linear-to-br from-violet-500/40 to-purple-600/30",
    featured: true,
    decorativeIcons: [Brain, Cpu, Database]
  },
  {
    icon: Globe,
    title: "Websites",
    subtitle: "Alta Conversão",
    description: "Landing pages e sites otimizados para SEO e performance. Transforme visitantes em clientes com designs modernos e estratégias de conversão.",
    features: ["Design moderno", "SEO otimizado", "Carregamento rápido", "Responsivo"],
    metrics: { value: "SEO", label: "técnico incluso" },
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    glowColor: "blue",
    spotlightColor: "59, 130, 246",
    accentColor: "bg-blue-500/20",
    iconBg: "bg-linear-to-br from-cyan-500/40 to-blue-600/30",
    featured: true,
    decorativeIcons: [Code2, Globe, Zap]
  },
  {
    icon: Zap,
    title: "Automações",
    subtitle: "Workflows Inteligentes",
    description: "Tire as tarefas repetitivas da sua equipe com fluxos automatizados que conectam suas ferramentas.",
    features: ["N8n & Make", "APIs conectadas", "Sem você programar"],
    metrics: { value: "24h", label: "rodando sem pausa" },
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glowColor: "amber",
    spotlightColor: "251, 146, 60",
    accentColor: "bg-amber-500/20",
    iconBg: "bg-linear-to-br from-amber-500/40 to-orange-600/30",
    decorativeIcons: [Workflow]
  },
  {
    icon: Layers,
    title: "Sistemas & Apps",
    subtitle: "SaaS & Mobile",
    description: "Desenvolvimento de plataformas escaláveis e aplicativos mobile nativos.",
    features: ["React & Node.js", "iOS & Android", "Escalável"],
    metrics: { value: "Sob medida", label: "para o seu processo" },
    gradient: "from-rose-400 via-pink-500 to-purple-500",
    glowColor: "pink",
    spotlightColor: "236, 72, 153",
    accentColor: "bg-pink-500/20",
    iconBg: "bg-linear-to-br from-rose-500/40 to-pink-600/30",
    decorativeIcons: [Database]
  }
];

// 3D Tilt Card Component with Enhanced Effects - Optimized for performance
const TiltCard = memo(function TiltCard({ children, className, intensity = 1 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const isDisabled = reduceMotion || isMobile;
  
  // Use CSS-based transforms instead of Framer Motion springs for better scroll performance
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDisabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = yPos * -10 * intensity;
    const rotateY = xPos * 10 * intensity;
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, [isDisabled, intensity]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  // Render simple div when disabled
  if (isDisabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
});

// Animated Number Counter - Optimized with IntersectionObserver instead of continuous RAF
const AnimatedCounter = memo(function AnimatedCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLSpanElement>(null);
  
  // Parse values outside of conditional
  const numericPart = useMemo(() => value.replace(/[^0-9]/g, ''), [value]);
  const suffix = useMemo(() => value.replace(/[0-9]/g, ''), [value]);
  const target = useMemo(() => parseInt(numericPart) || 0, [numericPart]);
  
  const [displayValue, setDisplayValue] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isDisabled = reduceMotion || isMobile;
  
  useEffect(() => {
    // Skip animation if disabled, already animated, or the value has no number
    // to count up to (e.g. "SEO", "Sob medida"): show the text as-is.
    if (isDisabled || hasAnimated || !numericPart) {
      setDisplayValue(value);
      return;
    }
    
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1200;
          const startTime = Date.now() + delay * 1000;
          let rafId: number;
          
          const animate = () => {
            const now = Date.now();
            if (now < startTime) {
              rafId = requestAnimationFrame(animate);
              return;
            }
            
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            setDisplayValue(current.toString() + suffix);
            
            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            }
          };
          
          rafId = requestAnimationFrame(animate);
          
          return () => {
            if (rafId) cancelAnimationFrame(rafId);
          };
        }
      },
      { threshold: 0.5, rootMargin: '50px' }
    );
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [target, suffix, delay, isDisabled, value, hasAnimated, numericPart]);
  
  return <span ref={ref}>{displayValue}</span>;
});

// Glowing Orb Effect
const GlowingOrb = memo(function GlowingOrb({ gradient, position = "top-right" }: { gradient: string; position?: string }) {
  const positions: Record<string, string> = {
    "top-right": "-top-20 -right-20",
    "bottom-left": "-bottom-20 -left-20",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  };
  const isMobile = useIsMobile();
  if (isMobile) return null;
  
  return (
    <>
      <div className={`absolute ${positions[position]} w-40 h-40 bg-linear-to-br ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-150`} />
      <div className={`absolute ${positions[position]} w-24 h-24 bg-linear-to-br ${gradient} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500`} />
    </>
  );
});

// Floating Decorative Icons
const FloatingIcons = memo(function FloatingIcons({ icons, gradient }: { icons: React.ComponentType<{ className?: string }>[]; gradient: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (reduceMotion || isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            right: `${10 + idx * 20}%`,
            bottom: `${15 + idx * 12}%`,
            opacity: 0.12,
          }}
          className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      ))}
    </div>
  );
});

// Feature List - otimizado sem animações pesadas
const FeatureList = memo(function FeatureList({ features, gradient }: { features: string[]; gradient: string }) {
  return (
    <ul className="space-y-2">
      {features.map((feature, idx) => (
        <li
          key={idx}
          className="flex items-center gap-2 text-xs text-white/80 group/item"
        >
          <span 
            className={`w-4 h-4 rounded-md bg-linear-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0`}
          >
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </span>
          <span className="group-hover/item:text-white transition-colors">{feature}</span>
        </li>
      ))}
    </ul>
  );
});

// Hero Card Component (Featured Large Card)
const HeroCard = memo(function HeroCard({ service, index }: { service: typeof services[0]; index: number }) {
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const skipAnimations = reduceMotion || isMobile;

  return (
    <motion.div
      initial={skipAnimations ? false : { opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: skipAnimations ? 0.15 : 0.5, delay: skipAnimations ? 0 : index * 0.08, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="h-full perspective-1000"
    >
      <TiltCard className="h-full" intensity={0.8}>
        <SpotlightCard
          spotlightColor={service.spotlightColor}
          className="group relative h-full overflow-hidden backdrop-blur-md bg-zinc-950/90 border border-white/10 transition-all duration-500 rounded-3xl hover:border-white/25 hover:shadow-2xl hover:shadow-purple-500/20 p-6 md:p-8 lg:p-10"
        >
          {/* Background Effects */}
          <GlowingOrb gradient={service.gradient} position="top-right" />
          <FloatingIcons icons={service.decorativeIcons || []} gradient={service.gradient} />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          {/* Featured Badge */}
          <div
            className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 border border-purple-400/30 backdrop-blur-md shadow-lg shadow-purple-500/10"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-xs font-semibold text-purple-200 tracking-wide">DESTAQUE</span>
          </div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col gap-5 mb-8">
              {/* Icon with CSS hover animation for better scroll performance */}
              <div
                className={`w-16 h-16 rounded-2xl ${service.iconBg} backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl shadow-purple-500/20 transition-transform duration-200 ease-out hover:scale-110 hover:rotate-3`}
              >
                <service.icon className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-[0.2em] bg-linear-to-r ${service.gradient} bg-clip-text text-transparent`}
                >
                  {service.subtitle}
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mt-2 leading-tight">
                  {service.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              {service.description}
            </p>

            {/* Content Grid */}
            <div className="flex flex-col lg:flex-row gap-8 flex-1">
              {/* Features */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg bg-linear-to-br ${service.gradient} flex items-center justify-center`}>
                    <Brain className="w-3.5 h-3.5 text-white" />
                  </div>
                  Recursos Inclusos
                </h4>
                <FeatureList features={service.features} gradient={service.gradient} />
              </div>
              
              {/* Metric Highlight - CSS hover for better performance */}
              <div className="flex items-end">
                <div 
                  className="p-6 md:p-8 rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/15 backdrop-blur-sm min-w-[180px] shadow-xl transition-transform duration-200 ease-out hover:scale-105 hover:-translate-y-1"
                >
                  <div className={`text-4xl md:text-5xl font-display font-bold bg-linear-to-r ${service.gradient} bg-clip-text text-transparent mb-2`}>
                    <AnimatedCounter value={service.metrics.value} delay={0.5} />
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wider font-medium">
                    {service.metrics.label}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RainbowButton className="h-12 px-6 text-sm font-semibold">
                  <MessageSquare className="w-4 h-4" />
                  Solicitar Demonstração
                  <ArrowRight className="w-4 h-4" />
                </RainbowButton>
              </a>
            </div>
          </div>

          {/* Border Glow - CSS only (opacity is compositor-friendly, no per-frame repaint) */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ boxShadow: "inset 0 0 60px rgba(168, 85, 247, 0.1), 0 0 80px rgba(168, 85, 247, 0.15)" }}
          />
        </SpotlightCard>
      </TiltCard>
    </motion.div>
  );
});

// Compact Hero Card (No Features Section - for Websites card)
const CompactHeroCard = memo(function CompactHeroCard({ service, index }: { service: typeof services[0]; index: number }) {
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const skipAnimations = reduceMotion || isMobile;

  return (
    <motion.div
      initial={skipAnimations ? false : { opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: skipAnimations ? 0.15 : 0.5, delay: skipAnimations ? 0 : index * 0.08, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="h-full perspective-1000"
    >
      <TiltCard className="h-full" intensity={0.8}>
        <SpotlightCard
          spotlightColor={service.spotlightColor}
          className="group relative h-full overflow-hidden backdrop-blur-md bg-zinc-950/90 border border-white/10 transition-all duration-500 rounded-3xl hover:border-white/25 hover:shadow-2xl hover:shadow-blue-500/20 p-6 md:p-8"
        >
          {/* Background Effects */}
          <GlowingOrb gradient={service.gradient} position="top-right" />
          <FloatingIcons icons={service.decorativeIcons || []} gradient={service.gradient} />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          {/* Featured Badge removido conforme solicitado */}

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 h-full">
            {/* Left: Icon + Title + Description */}
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`w-14 h-14 rounded-2xl ${service.iconBg} backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl shadow-blue-500/20 shrink-0 transition-transform duration-200 ease-out hover:scale-110 hover:rotate-3`}
              >
                <service.icon className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] bg-linear-to-r ${service.gradient} bg-clip-text text-transparent`}
                >
                  {service.subtitle}
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mt-1 leading-tight">
                  {service.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mt-2 max-w-sm line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
            
            {/* Right: Metric + CTA */}
            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-3">
              <div 
                className="p-4 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/15 backdrop-blur-sm shadow-lg text-center transition-transform duration-200 ease-out hover:scale-105"
              >
                <div className={`text-3xl font-display font-bold bg-linear-to-r ${service.gradient} bg-clip-text text-transparent`}>
                  <AnimatedCounter value={service.metrics.value} delay={0.5} />
                </div>
                <div className="text-[10px] text-white/60 uppercase tracking-wider font-medium">
                  {service.metrics.label}
                </div>
              </div>
              
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full h-12 rounded-xl bg-linear-to-br ${service.gradient} flex items-center justify-center gap-2 cursor-pointer shadow-lg`}
                >
                  <span className="text-sm font-semibold text-white">Saiba mais</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.div>
              </a>
            </div>
          </div>

          {/* Border Glow - CSS only (opacity is compositor-friendly, no per-frame repaint) */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ boxShadow: "inset 0 0 60px rgba(59, 130, 246, 0.1), 0 0 80px rgba(59, 130, 246, 0.15)" }}
          />
        </SpotlightCard>
      </TiltCard>
    </motion.div>
  );
});

// Standard Card Component
const StandardCard = memo(function StandardCard({ service, index }: { service: typeof services[0]; index: number }) {
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const skipAnimations = reduceMotion || isMobile;

  return (
    <motion.div
      initial={skipAnimations ? false : { opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: skipAnimations ? 0.15 : 0.5, delay: skipAnimations ? 0 : 0.1 + index * 0.1, type: skipAnimations ? "tween" : "spring", stiffness: 120 }}
      viewport={{ once: true, margin: "-50px" }}
      className="h-full perspective-1000"
    >
      <TiltCard className="h-full">
        <SpotlightCard
          spotlightColor={service.spotlightColor}
          className="group relative h-full overflow-hidden backdrop-blur-md bg-zinc-950/80 border border-white/10 transition-all duration-500 rounded-2xl hover:border-white/25 hover:shadow-xl p-5"
        >
          {/* Glow Effect */}
          <GlowingOrb gradient={service.gradient} position="top-right" />
          
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg ${service.iconBg} backdrop-blur-sm flex items-center justify-center border border-white/15 shadow-lg transition-transform duration-200 ease-out hover:scale-115 hover:rotate-6`}
              >
                <service.icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <span className={`text-[9px] font-bold uppercase tracking-[0.15em] bg-linear-to-r ${service.gradient} bg-clip-text text-transparent`}>
                  {service.subtitle}
                </span>
                <h3 className="text-lg font-display font-bold text-white mt-0.5">
                  {service.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/60 text-xs leading-relaxed mb-3 line-clamp-2">
              {service.description}
            </p>

            {/* Features */}
            <div className="flex-1 mb-3">
              <FeatureList features={service.features.slice(0, 3)} gradient={service.gradient} />
            </div>
            
            {/* Metric & Arrow */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: `rgb(${service.spotlightColor})` }} />
                <span className={`text-lg font-bold bg-linear-to-r ${service.gradient} bg-clip-text text-transparent`}>
                  <AnimatedCounter value={service.metrics.value} delay={0.3 + index * 0.1} />
                </span>
                <span className="text-[10px] text-white/50">{service.metrics.label}</span>
              </div>
              
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded-lg bg-linear-to-br ${service.gradient} flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 ease-out hover:scale-115 hover:rotate-3 hover:shadow-xl active:scale-95`}
              >
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>

          {/* Subtle animated line - CSS only */}
          <div 
            className={`absolute bottom-0 left-0 h-1 bg-linear-to-r ${service.gradient} rounded-b-2xl w-0 group-hover:w-full transition-all duration-500 ease-out`}
          />
        </SpotlightCard>
      </TiltCard>
    </motion.div>
  );
});

export default function Services() {
  const featuredServices = services.filter(s => s.featured);
  const standardServices = services.filter(s => !s.featured);
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  
  // Disable animations on mobile for better performance
  const shouldAnimate = !isMobile && !reduceMotion;
  
  return (
    <section id="services" className="py-16 sm:py-20 md:py-28 px-4 md:px-6 relative overflow-hidden">
      {/* Enhanced Background Effects (lazy-loaded) - skip on mobile */}
      {!isMobile && (
        <Suspense fallback={
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-32 w-[360px] h-[360px] bg-linear-to-br from-purple-500/12 via-violet-500/06 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 -right-32 w-[420px] h-[420px] bg-linear-to-br from-blue-500/10 via-cyan-500/06 to-transparent rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-linear-to-br from-pink-500/06 via-purple-500/03 to-transparent rounded-full blur-2xl" />
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
        }>
          <ServicesBackground reduceMotion={reduceMotion} />
        </Suspense>
      )}
      
      {/* Simple mobile background fallback */}
      {isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-16 w-[180px] h-[180px] bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-16 w-[200px] h-[200px] bg-blue-500/8 rounded-full blur-3xl" />
        </div>
      )}

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 text-center max-w-4xl mx-auto">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.9 } : false}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: isMobile ? 0.2 : undefined }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-linear-to-r from-white/5 via-white/10 to-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-linear-to-r from-purple-400 to-pink-400" />
            <span className="text-sm font-medium text-white/80 tracking-wide">Nossas Soluções</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>
          
          <motion.h2 
            initial={shouldAnimate ? { opacity: 0, y: 25 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: shouldAnimate ? 0.1 : 0, duration: 0.5, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-6 sm:mb-8 leading-[1.1]"
          >
            <span className="text-white">Tecnologia que</span>
            <br />
            <span className="bg-linear-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transforma Resultados
            </span>
          </motion.h2>
          
          <motion.p 
            initial={shouldAnimate ? { opacity: 0, y: 25 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: shouldAnimate ? 0.2 : 0, duration: 0.5, ease: "easeOut" }}
            className="text-white/50 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto px-2 sm:px-0"
          >
            Soluções sob medida para automatizar processos, atender mais rápido e liberar sua equipe para o que importa.
          </motion.p>
        </div>

        {/* Modern Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 auto-rows-[minmax(140px,auto)] gap-4 md:gap-5">
          {/* First Featured Card - Large left */}
          <div className="md:col-span-4 lg:col-span-5 md:row-span-2">
            <HeroCard service={featuredServices[0]} index={0} />
          </div>
          
          {/* First Standard Card - Top right */}
          <div className="md:col-span-2 lg:col-span-3 md:row-span-1">
            <StandardCard service={standardServices[0]} index={1} />
          </div>
          
          {/* Second Standard Card - Middle right */}
          <div className="md:col-span-2 lg:col-span-4 md:row-span-1">
            <StandardCard service={standardServices[1]} index={2} />
          </div>
          
          {/* Second Featured Card - Websites (Alta Conversão) - Compact version */}
          <div className="md:col-span-6 lg:col-span-7 md:row-span-1">
            <CompactHeroCard service={featuredServices[1]} index={3} />
          </div>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldAnimate ? 0.3 : 0, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-28"
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-zinc-900/90 via-zinc-950/95 to-zinc-900/90 border border-white/10 backdrop-blur-md p-5 sm:p-8 md:p-10">
            {/* Background Glow - simplified on mobile */}
            {!isMobile && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              </div>
            )}
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Animated Icons Stack */}
                <div className="flex -space-x-3">
                  {[
                    { Icon: Shield, gradient: "from-purple-400 to-pink-500" },
                    { Icon: Clock, gradient: "from-blue-400 to-cyan-500" },
                    { Icon: TrendingUp, gradient: "from-amber-400 to-orange-500" }
                  ].map(({ Icon, gradient }, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center border-2 border-zinc-950 shadow-lg`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  ))}
                </div>
                
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-white mb-1">
                    Projeto personalizado?
                  </h3>
                  <p className="text-white/50 text-xs sm:text-sm md:text-base">
                    Conte-nos sua necessidade e criaremos a solução ideal
                  </p>
                </div>
              </div>
              
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-auto"
              >
                <RainbowButton className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold w-full">
                  Falar com Especialista
                  <ArrowRight className="w-5 h-5" />
                </RainbowButton>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
