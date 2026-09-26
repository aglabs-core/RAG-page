import { Suspense, lazy, memo } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatbotProvider } from "@/components/ChatbotContext";

// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/Home"));
const AppRedirect = lazy(() => import("@/pages/AppRedirect"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Simple page loading fallback
const PageLoader = memo(() => {
  // Na home, enquanto a página carrega, repete o topo que já veio no HTML.
  if (window.__homeShell && window.location.pathname === "/") {
    return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: window.__homeShell }} />;
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
    </div>
  );
});
PageLoader.displayName = "PageLoader";

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/app" component={AppRedirect} />
        <Route path="/aglabs" component={AppRedirect} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChatbotProvider>
          <ErrorBoundary>
            <Toaster />
            <Router />
          </ErrorBoundary>
        </ChatbotProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
