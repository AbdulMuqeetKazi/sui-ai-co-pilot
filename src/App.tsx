
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CodeSnippetGenerator from "./pages/CodeSnippetGenerator";
import ConceptExplorer from "./pages/ConceptExplorer";
import SuiWalletPanel from "./pages/SuiWalletPanel";
import CodeAndConcepts from "./pages/CodeAndConcepts";
import SuiDeveloperAssistant from "./pages/SuiDeveloperAssistant";
import '@suiet/wallet-kit/style.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/code-snippets" element={<CodeSnippetGenerator />} />
            <Route path="/concepts" element={<ConceptExplorer />} />
            <Route path="/wallet" element={<SuiWalletPanel />} />
            <Route path="/code-and-concepts" element={<CodeAndConcepts />} />
            <Route path="/sui-assistant" element={<SuiDeveloperAssistant />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
