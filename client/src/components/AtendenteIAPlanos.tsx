import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Star } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useIsMobile } from "@/hooks/use-mobile";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const WHATSAPP_BASE = "https://wa.me/5564993259857?text=";

const plans = [
  {
    id: "start",
    name: "Start",
    badge: "🥉",
    price: "147",
    setup: null,
    setupLabel: "sem setup",
    description: "Comece a atender seus clientes 24/7 sem investimento inicial.",
    features: [
      "Atendente IA no WhatsApp respondendo 24/7",
      "Respostas às perguntas frequentes do negócio",
      "Captura de nome e contato do cliente",
      "Configuração inclusa no primeiro mês",
    ],
    accent: "border-amber-700/30",
    badgeBg: "bg-amber-900/20",
    badgeText: "text-amber-400",
    glowColor: "",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "🥈",
    price: "297",
    setup: "197",
    setupLabel: "setup R$197",
    description: "Automatize agendamentos e acompanhe cada lead até o fechamento.",
    features: [
      "Tudo do Start",
      "Agendamento automático integrado",
      "Follow-up automático de leads que não fecharam",
      "Relatório mensal de atendimentos e leads",
    ],
    accent: "border-purple-500/30",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    glowColor: "shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)]",
    popular: true,
  },
  {
    id: "cororate",
    name: "Corporate",
    badge: "🥇",
    price: "597",
    setup: "397",
    setupLabel: "setup R$397",
    description: "IA avançada com personalidade da sua marca, em múltiplos canais.",
    features: [
      "Tudo do Pro",
      "Agente IA avançado com personalidade da marca",
      "Integração WhatsApp + Telegram",
      "CRM + API's + MCP's",
      "Suporte avançado de configuração",
    ],
    accent: "border-yellow-500/30",
    badgeBg: "bg-yellow-500/10",
    badgeText: "text-yellow-400",
    glowColor: "",
    popular: false,
  },
];

function AtendenteIAPlanos() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !isMobile && !reducedMotion;

  return (
    <section id="planos" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400 mb-6">
            <Sparkles className="w-4 h-4" />
            Planos Atendente IA
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4">
            <span className="text-white">Escolha o plano ideal </span>
            <span className="bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              para seu negócio
            </span>
          </h2>

          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
            Comece pequeno, escale quando quiser. Todos os planos incluem suporte e atualizações.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: isMobile ? 0.2 : 0.6,
                delay: shouldAnimate ? index * 0.1 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "relative rounded-2xl border bg-zinc-900/40 backdrop-blur-sm p-6 sm:p-8 flex flex-col",
                plan.accent,
                plan.glowColor,
                plan.popular && "md:-mt-4 md:-mb-4"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 text-xs font-semibold bg-linear-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3" /> Recomendado
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{plan.badge}</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{plan.name}</h3>
                </div>
                <p className="text-sm text-white/40">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-white/40">R$</span>
                  <span className="text-4xl sm:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-white/40">/mês</span>
                </div>
                <p className={cn("text-xs mt-1", plan.setup ? "text-white/40" : "text-green-400/70")}>
                  ({plan.setupLabel})
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={`${WHATSAPP_BASE}Olá!%20Tenho%20interesse%20no%20plano%20${plan.name}%20do%20Atendente%20IA.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                {plan.popular ? (
                  <RainbowButton className="h-12 w-full text-sm">
                    Quero o {plan.name}
                    <ArrowRight className="w-4 h-4" />
                  </RainbowButton>
                ) : (
                  <button className="w-full h-12 rounded-lg border border-white/15 bg-white/5 text-white text-sm font-medium hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                    Quero o {plan.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={shouldAnimate ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-white/30 mt-8 sm:mt-12 max-w-lg mx-auto"
        >
          Todos os planos podem ser cancelados a qualquer momento. 
          Dúvidas? Fale com a gente no WhatsApp.
        </motion.p>
      </div>
    </section>
  );
}

export default memo(AtendenteIAPlanos);
