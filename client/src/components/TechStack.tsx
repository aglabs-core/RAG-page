import { SectionHeading } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import TechShowcase, { type TechItem } from "./ui/tech-showcase";

const TECH_IMG =
  "https://udcsokdtdqqdnoqozbxh.supabase.co/storage/v1/object/public/heros-lp/aglabs/workflow";

const tech: TechItem[] = [
  { id: "n8n", name: "n8n", category: "Automação de workflows", image: `${TECH_IMG}/n8n.jpg` },
  { id: "claude-code", name: "Claude Code", category: "Agente de programação", image: `${TECH_IMG}/claudecode.jpg` },
  { id: "openclaw", name: "OpenClaw", category: "Automação inteligente", image: `${TECH_IMG}/openclaw.jpg` },
  { id: "hermes", name: "Hermes Agent", category: "Agentes de IA", image: `${TECH_IMG}/hermes.jpg` },
  { id: "paperclip", name: "Paperclip", category: "Orquestração de agentes", image: `${TECH_IMG}/paperclip.png` },
  { id: "claude-cowork", name: "Claude Cowork", category: "Colaboração com IA", image: `${TECH_IMG}/cowork.jpg` },
];

export function TechStack() {
  return (
    <section
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ backgroundColor: "#050505" }}
    >
      <div className="relative z-[1] mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-4">
            <SectionHeading className="max-w-3xl">
              Usamos tecnologias consolidadas de{" "}
              <span className="text-gradient-green">automação</span> e IA
            </SectionHeading>
            <p className="max-w-xl text-[14px] leading-relaxed text-mist">
              Combinamos ferramentas de automação e IA amplamente usadas no
              mercado para entregar fluxos confiáveis e sob medida para o seu
              negócio.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-12 lg:mt-16">
          <TechShowcase items={tech} />
        </Reveal>
      </div>
    </section>
  );
}
