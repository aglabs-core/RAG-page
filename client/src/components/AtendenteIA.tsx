import { memo } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CalendarCheck,
  UserCheck,
  Send,
  Bot,
  Scissors,
  Stethoscope,
  Dumbbell,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useIsMobile } from "@/hooks/use-mobile";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";

const WHATSAPP_LINK =
  "https://wa.me/5564993259857?text=Quero%20saber%20mais%20sobre%20o%20Atendente%20IA...";

const benefits = [
  {
    icon: Clock,
    title: "Atendimento 24/7",
    description: "Seu WhatsApp respondendo em segundos, a qualquer hora, inclusive fins de semana e feriados. Quando não sabe, passa para a sua equipe.",
  },
  {
    icon: CalendarCheck,
    title: "Agendamento automático",
    description: "O atendente marca horários, envia lembretes e organiza sua agenda sem precisar de você.",
  },
  {
    icon: UserCheck,
    title: "Captura de leads",
    description: "Coleta nome, telefone e interesse de cada cliente e registra o contato no seu CRM.",
  },
  {
    icon: Send,
    title: "Follow-up inteligente",
    description: "Retoma a conversa com leads que pararam de responder, sem depender de alguém lembrar.",
  },
];

function AtendenteIA() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !isMobile && !reducedMotion;

  return (
    <section id="atendente-ia" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-green-500/5 blur-[100px] sm:blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400 mb-6">
            <Bot className="w-4 h-4" />
            Mensagens Automáticas
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-4 sm:mb-6">
            <span className="bg-linear-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Atendente IA
            </span>
            <span className="text-white/80 block text-xl sm:text-2xl md:text-3xl mt-2 font-medium">
              AG LABS
            </span>
          </h2>

          <p className="text-white/60 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Seu WhatsApp atendendo, agendando e vendendo{" "}
            <span className="text-white font-medium">
              sem você precisar estar online.
            </span>
          </p>
        </motion.div>

        {/* Chat Mockup + Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 md:mb-24">
          {/* Chat Mockup */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, x: -30 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: isMobile ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative max-w-sm mx-auto lg:mx-0">
              {/* Phone frame */}
              <div className="rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-green-500/5">
                {/* WhatsApp header */}
                <div className="px-4 py-3 bg-[#075E54] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Atendente IA</p>
                    <p className="text-white/60 text-xs">online</p>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-4 space-y-3 bg-[#0b141a] min-h-[280px]">
                  {/* Client message */}
                  <div className="flex justify-end">
                    <div className="bg-[#005c4b] rounded-lg rounded-tr-sm px-3 py-2 max-w-[80%]">
                      <p className="text-sm text-white/90">Oi, vocês têm horário disponível amanhã?</p>
                      <p className="text-[10px] text-white/40 text-right mt-1">14:32</p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className="bg-[#1f2c34] rounded-lg rounded-tl-sm px-3 py-2 max-w-[85%]">
                      <p className="text-sm text-white/80">
                        Olá! 😊 Sim, temos horários disponíveis amanhã.
                        <br /><br />
                        Posso agendar para você? Temos:
                        <br />
                        • <span className="text-green-400">09:00</span>
                        <br />
                        • <span className="text-green-400">14:00</span>
                        <br />
                        • <span className="text-green-400">16:30</span>
                        <br /><br />
                        Qual horário prefere?
                      </p>
                      <p className="text-[10px] text-white/40 text-right mt-1">14:32</p>
                    </div>
                  </div>

                  {/* Client response */}
                  <div className="flex justify-end">
                    <div className="bg-[#005c4b] rounded-lg rounded-tr-sm px-3 py-2 max-w-[80%]">
                      <p className="text-sm text-white/90">14h tá ótimo!</p>
                      <p className="text-[10px] text-white/40 text-right mt-1">14:33</p>
                    </div>
                  </div>

                  {/* AI confirmation */}
                  <div className="flex justify-start">
                    <div className="bg-[#1f2c34] rounded-lg rounded-tl-sm px-3 py-2 max-w-[85%]">
                      <p className="text-sm text-white/80">
                        Perfeito! ✅ Agendado para amanhã às <span className="text-green-400 font-medium">14:00</span>.
                        <br /><br />
                        Me passa seu nome completo para confirmar?
                      </p>
                      <p className="text-[10px] text-white/40 text-right mt-1">14:33</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-4 bg-green-500/5 rounded-3xl blur-2xl -z-10" />
            </div>
          </motion.div>

          {/* Benefits Cards */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, x: 30 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: isMobile ? 0.2 : 0.7, delay: isMobile ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/3 border border-white/6 hover:border-green-500/20 transition-all duration-300 hover:bg-white/5"
              >
                <div className="shrink-0 w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <benefit.icon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* "Para quem é" — Premium Cards */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/50 mb-5 uppercase tracking-widest">
              Segmentos
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Ideal para quem…
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: Scissors,
                title: "Salões & Barbearias",
                desc: "Perde clientes porque não responde rápido no WhatsApp.",
                color: "236, 72, 153",
              },
              {
                icon: Stethoscope,
                title: "Clínicas & Consultórios",
                desc: "Precisa organizar agendamentos sem uma recepcionista 24h.",
                color: "34, 197, 94",
              },
              {
                icon: Store,
                title: "Lojas & E-commerces",
                desc: "Quer vender mais sem precisar contratar.",
                color: "168, 85, 247",
              },
              {
                icon: UtensilsCrossed,
                title: "Restaurantes & Delivery",
                desc: "Não consegue atender pedidos fora do horário comercial.",
                color: "251, 146, 60",
              },
              {
                icon: Dumbbell,
                title: "Academias & Personal",
                desc: "Precisa parecer profissional e responder na hora.",
                color: "56, 189, 248",
              },
              {
                icon: Bot,
                title: "Qualquer Negócio Local",
                desc: "Quer escalar o atendimento sem escalar a equipe.",
                color: "139, 92, 246",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  delay: shouldAnimate ? i * 0.07 : 0,
                  duration: isMobile ? 0.15 : 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SpotlightCard
                  className="h-full p-5 sm:p-6"
                  spotlightColor={item.color}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `rgba(${item.color}, 0.12)` }}
                    >
                      <item.icon
                        className="w-5 h-5"
                        style={{ color: `rgb(${item.color})` }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
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

export default memo(AtendenteIA);
