import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clipboard } from "lucide-react";
import heroImage from "@/assets/hero-pitch.jpg";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [rememberChoice, setRememberChoice] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const autoLogin = localStorage.getItem("autoLogin");
    if (savedRole && autoLogin === "true") {
      navigate(savedRole === "coach" ? "/coach-dashboard" : "/player-dashboard");
    }
  }, [navigate]);

  const selectRole = (role: "coach" | "player") => {
    localStorage.setItem("userRole", role);
    if (rememberChoice) {
      localStorage.setItem("autoLogin", "true");
    } else {
      localStorage.removeItem("autoLogin");
    }
    navigate(role === "coach" ? "/coach-dashboard" : "/player-dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center text-primary-foreground mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Välkommen till FotbollsTräning
            </h1>
            <p className="text-lg md:text-xl mb-4 opacity-95">
              Välj din roll för att komma igång
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto mb-6">
            {/* Coach Card */}
            <Card 
              className="hover:shadow-2xl transition-all hover:-translate-y-1 border-2 bg-card/95 backdrop-blur cursor-pointer"
              onClick={() => selectRole("coach")}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Clipboard className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Tränare</CardTitle>
                <CardDescription className="text-sm">
                  Planera träningar och följ lagets utveckling
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Player Card */}
            <Card 
              className="hover:shadow-2xl transition-all hover:-translate-y-1 border-2 bg-card/95 backdrop-blur cursor-pointer"
              onClick={() => selectRole("player")}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-3 shadow-lg relative">
                  <svg viewBox="0 0 100 100" className="w-10 h-10">
                    <rect x="20" y="30" width="60" height="50" fill="white" rx="5"/>
                    <circle cx="50" cy="40" r="8" fill="currentColor" className="text-accent-foreground"/>
                    <text x="50" y="72" fontSize="24" fontWeight="bold" textAnchor="middle" fill="currentColor" className="text-accent-foreground">10</text>
                  </svg>
                </div>
                <CardTitle className="text-2xl">Spelare</CardTitle>
                <CardDescription className="text-sm">
                  Träna självständigt och följ din utveckling
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Remember choice checkbox */}
          <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
            <Checkbox 
              id="remember" 
              checked={rememberChoice}
              onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
            />
            <Label 
              htmlFor="remember" 
              className="text-primary-foreground text-sm cursor-pointer"
            >
              Kom ihåg mitt val och logga in automatiskt
            </Label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoleSelection;
