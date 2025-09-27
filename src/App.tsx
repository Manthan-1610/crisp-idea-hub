import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ideas from "./pages/Ideas";
import StoryBuilder from "./pages/StoryBuilder";
import Backlog from "./pages/Backlog";
import MVP from "./pages/MVP";
import SprintReadiness from "./pages/SprintReadiness";
import Exports from "./pages/Exports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/story-builder" element={<StoryBuilder />} />
            <Route path="/backlog" element={<Backlog />} />
            <Route path="/mvp" element={<MVP />} />
            <Route path="/sprint-readiness" element={<SprintReadiness />} />
            <Route path="/exports" element={<Exports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
