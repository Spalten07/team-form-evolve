import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Clipboard,
  Dumbbell,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero-pitch.jpg";

const RoleSelection = () => {
  const navigate = useNavigate();

  const selectRole = (role: "coach" | "player") => {
    localStorage.setItem("userRole", role);
    navigate(role === "coach" ? "/home" : "/exercises");
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
          <div className="max-w-5xl mx-auto text-center text-primary-foreground mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Välkommen till FotbollsTräning
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-95">
              Välj din roll för att komma igång
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Coach Card */}
            <Card className="hover:shadow-2xl transition-all hover:-translate-y-2 border-2 bg-card/95 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clipboard className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl">Jag är Tränare</CardTitle>
                <CardDescription className="text-base">
                  Planera träningar, skapa övningar och följ lagets utveckling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Skapa och planera träningspass</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Tillgång till övningsbank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Skicka ut quizar och hemuppgifter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Kalenderöversikt</span>
                  </li>
                </ul>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full"
                  onClick={() => selectRole("coach")}
                >
                  Fortsätt som Tränare
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Player Card */}
            <Card className="hover:shadow-2xl transition-all hover:-translate-y-2 border-2 bg-card/95 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Dumbbell className="w-10 h-10 text-accent-foreground" />
                </div>
                <CardTitle className="text-3xl">Jag är Spelare</CardTitle>
                <CardDescription className="text-base">
                  Träna självständigt, lär dig teori och följ din utveckling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Övningar för hemmaträning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Interaktiva quizar och teori</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Progressionssystem och nivåer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Följ din utveckling</span>
                  </li>
                </ul>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full"
                  onClick={() => selectRole("player")}
                >
                  Fortsätt som Spelare
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoleSelection;
