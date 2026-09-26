import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";
import { ChatbotProvider } from "@/components/ChatbotContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Topo da home gerado no build: o HTML de "/" já chega com o cabeçalho e o hero,
// e o React substitui este conteúdo ao montar. Espelha o invólucro de
// pages/Home.tsx para o layout não pular na troca.
export function renderHomeShell(): string {
  return renderToStaticMarkup(
    <Router ssrPath="/">
      <ChatbotProvider>
        <div className="min-h-screen bg-black text-foreground overflow-x-hidden selection:bg-purple-500/30 relative">
          <div className="bg-noise" />
          <Navbar />
          <main>
            <Hero />
          </main>
        </div>
      </ChatbotProvider>
    </Router>,
  );
}
