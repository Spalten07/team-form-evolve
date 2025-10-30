import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  Target,
  Trophy,
  TrendingUp,
  Calendar
} from "lucide-react";

const PlayerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Min översikt
          </h1>
          <p className="text-muted-foreground text-lg">
            Din statistik och resultat
          </p>
        </div>

        {/* Personal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Närvaro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1">Senaste 3 månaderna</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Träningar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18</div>
              <p className="text-xs text-muted-foreground mt-1">Egna träningar denna månad</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Utveckling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+15%</div>
              <p className="text-xs text-muted-foreground mt-1">Ökning i träningstid</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Matcher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Spelade matcher</p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Senaste resultat
            </CardTitle>
            <CardDescription>
              Lagets senaste matcher i serien
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <div>
                <p className="font-semibold">Vårt lag - Motståndare A</p>
                <p className="text-sm text-muted-foreground">2025-10-27</p>
              </div>
              <div className="text-right">
                <Badge className="bg-success text-success-foreground">Vinst</Badge>
                <p className="text-lg font-bold mt-1">3 - 1</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div>
                <p className="font-semibold">Motståndare B - Vårt lag</p>
                <p className="text-sm text-muted-foreground">2025-10-20</p>
              </div>
              <div className="text-right">
                <Badge className="bg-warning text-warning-foreground">Oavgjort</Badge>
                <p className="text-lg font-bold mt-1">2 - 2</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <div>
                <p className="font-semibold">Vårt lag - Motståndare C</p>
                <p className="text-sm text-muted-foreground">2025-10-13</p>
              </div>
              <div className="text-right">
                <Badge className="bg-success text-success-foreground">Vinst</Badge>
                <p className="text-lg font-bold mt-1">4 - 2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Focus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Vad jag tränat mest på
            </CardTitle>
            <CardDescription>
              Fördelning av träningsfokus senaste månaden
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Teknik & Bollkontroll</span>
                  <span className="text-sm text-muted-foreground">40%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "40%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Passning & Mottagning</span>
                  <span className="text-sm text-muted-foreground">30%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "30%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Avslut & Skott</span>
                  <span className="text-sm text-muted-foreground">20%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "20%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Kondition & Uthållighet</span>
                  <span className="text-sm text-muted-foreground">10%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PlayerDashboard;
