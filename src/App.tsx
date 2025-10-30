import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import Home from "./pages/Home";
import Exercises from "./pages/Exercises";
import Theory from "./pages/Theory";
import Quiz from "./pages/Quiz";
import Planner from "./pages/Planner";
import CreateTraining from "./pages/CreateTraining";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/theory" element={<Theory />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/create-training" element={<CreateTraining />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
