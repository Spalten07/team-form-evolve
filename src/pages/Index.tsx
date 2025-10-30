import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Dumbbell, 
  BookOpen, 
  CalendarDays, 
  Users, 
  Trophy,
  Target,
  Zap,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero-pitch.jpg";

const Index = () => {
  const features = [
    {
      icon: Dumbbell,
      title: "Övningsbank",
      description: "Hundratals övningar för alla nivåer och situationer",
      link: "/exercises",
      color: "text-success"
    },
    {
      icon: BookOpen,
      title: "Teoribank",
      description: "Lär dig regler, taktik och fotbollshistoria genom interaktiva quizar",
      link: "/theory",
      color: "text-warning"
    },
    {
      icon: CalendarDays,
      title: "Träningsplanering",
      description: "Planera och organisera dina träningar effektivt",
      link: "/planner",
      color: "text-accent"
    }
  ];

  const benefits = [
    { icon: Target, text: "Anpassat för alla åldrar och nivåer" },
    { icon: Users, text: "För både tränare och spelare" },
    { icon: Zap, text: "Snabb och enkel träningsplanering" },
    { icon: TrendingUp, text: "Följ din utveckling med statistik" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Din kompletta fotbollsträningsapp
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Planera träningar, utveckla din kunskap och bli en bättre fotbollsspelare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg" asChild>
                <Link to="/exercises">
                  Kom igång
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                Läs mer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Allt du behöver på ett ställe
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Från grundläggande övningar till avancerad taktik - vi har allt du behöver för att utvecklas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all hover:-translate-y-1 border-2"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 shadow-md`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="default" className="w-full" asChild>
                    <Link to={feature.link}>
                      Utforska
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Varför FotbollsTräning?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <p className="text-lg font-medium pt-1">{benefit.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-hero text-primary-foreground border-0 shadow-xl">
          <CardContent className="p-8 md:p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Redo att ta din fotboll till nästa nivå?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Gå med idag och få tillgång till alla övningar, quizar och planeringsverktyg
            </p>
            <Button variant="hero" size="lg" className="text-lg" asChild>
              <Link to="/exercises">
                Börja träna nu
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
