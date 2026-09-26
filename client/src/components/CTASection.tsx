import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Shield, Zap } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useChatbot } from "@/components/ChatbotContext";
import { useIsMobile } from "@/hooks/use-mobile";

const WHATSAPP_LINK = "https://wa.me/5564993259857?text=Quero%20saber%20mais%20sobre%20o%20Agente%20RAG...";

// Trust badges data - defined outside component to avoid recreation
const trustBadges = [
  { icon: Clock, text: "Resposta em 24h" },
  { icon: Shield, text: "Privacidade conforme a LGPD" },
  { icon: Zap, text: "Implementação Rápida" },
] as const;

function CTASection() {
  const { openChat } = useChatbot();
  const isMobile = useIsMobile();
  
  return (
    <section className="py-24 md:py-32 px-4 md:px-6 relative overflow-hidden">
      {/* FlickeringGrid Background - optimized for mobile */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="absolute inset-0 w-full h-full mask-[linear-gradient(to_bottom,transparent_0%,white_15%,white_85%,transparent_100%)]"
          squareSize={isMobile ? 6 : 4}
          gridGap={isMobile ? 12 : 8}
          color="#A855F7"
          maxOpacity={isMobile ? 0.15 : 0.2}
          flickerChance={isMobile ? 0.015 : 0.03}
        />
      </div>
      
      {/* Background Effects - simplified on mobile */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40 z-1" />
      <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30 z-1" />
      <div className={`absolute top-[60%] left-[70%] -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'w-[300px] h-[300px] blur-[80px]' : 'w-[600px] h-[600px] blur-[150px]'} bg-purple-600/15 rounded-full z-0`} />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={isMobile ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: isMobile ? 0.2 : 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm font-medium text-purple-400 mb-6 sm:mb-8"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Diagnóstico Gratuito e Sem Compromisso</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-4 sm:mb-6 leading-tight">
            Pronto para{" "}
            <span className="text-gradient">Escalar</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>seu Negócio com IA?
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Agende uma consultoria gratuita de 30 minutos e descubra quais tarefas repetitivas do seu negócio um agente de IA pode assumir.
          </p>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            {trustBadges.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white/60"
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <span className="text-xs sm:text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0"
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <RainbowButton className="h-14 sm:h-16 px-6 sm:px-10 text-base sm:text-lg w-full">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                Agendar Diagnóstico Gratuito
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </RainbowButton>
            </a>
            
            <button 
              onClick={openChat}
              className="group h-14 sm:h-16 px-6 sm:px-10 text-base sm:text-lg font-medium rounded-lg border border-white/20 hover:border-purple-500/50 bg-white/5 backdrop-blur-md text-white transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] active:scale-95 sm:hover:scale-105"
            >
              Teste a Eficiência Agora
            </button>
          </div>
          
          {/* Social proof */}
          <p
            className="mt-8 text-sm text-white/40"
          >
            Sem compromisso: você sai da conversa sabendo o que dá para automatizar.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(CTASection);
