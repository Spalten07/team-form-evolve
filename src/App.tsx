import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RoleSelection from "./pages/RoleSelection";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Exercises from "./pages/Exercises";
import Theory from "./pages/Theory";
import Quiz from "./pages/Quiz";
import Planner from "./pages/Planner";
import CreateTraining from "./pages/CreateTraining";
import Players from "./pages/Players";
import PlayerHistory from "./pages/PlayerHistory";
import PlayerCalendar from "./pages/PlayerCalendar";
import PlayerPastActivities from "./pages/PlayerPastActivities";
import SendCallup from "./pages/SendCallup";
import SavedTrainings from "./pages/SavedTrainings";
import CoachDashboard from "./pages/CoachDashboard";
import PlayerDashboard from "./pages/PlayerDashboard";
import LeagueTables from "./pages/LeagueTables";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/coach-dashboard" element={<CoachDashboard />} />
            <Route path="/player-dashboard" element={<PlayerDashboard />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/theory" element={<Theory />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/create-training" element={<CreateTraining />} />
            <Route path="/players" element={<Players />} />
            <Route path="/player-history" element={<PlayerHistory />} />
            <Route path="/player-calendar" element={<PlayerCalendar />} />
            <Route path="/player-calendar/:playerId" element={<PlayerCalendar />} />
            <Route path="/player-past-activities" element={<PlayerPastActivities />} />
            <Route path="/send-callup" element={<SendCallup />} />
            <Route path="/saved-trainings" element={<SavedTrainings />} />
            <Route path="/league-tables" element={<LeagueTables />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
