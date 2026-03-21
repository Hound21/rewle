import { createRoot } from "react-dom/client";
import "@/index.css";
import HigherLowerPage from "@/games/higher-lower/HigherLowerPage";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HigherLowerPage />
    </TooltipProvider>
  </QueryClientProvider>
);
