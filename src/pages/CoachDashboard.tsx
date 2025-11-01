import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Calendar,
  Target,
  Trophy,
  Activity
} from "lucide-react";
import { TeamCodeCard } from "@/components/TeamCodeCard";

const CoachDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Översikt
          </h1>
          <p className="text-muted-foreground text-sm">
            Lagets statistik och resultat
          </p>
        </div>

        {/* Team Code Card */}
        <TeamCodeCard />

        {/* Next Match Info */}
        <Card className="mb-8 bg-gradient-hero text-primary-foreground border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Nästa match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">Vårt lag vs Frösö IF</p>
              <p className="text-sm opacity-90">Lördag 9 november, 17:00</p>
              <p className="text-sm opacity-90">Östermalms IP</p>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-3 mt-3">
                <p className="text-sm font-medium">Division 3 Norra</p>
                <p className="text-xs opacity-90 mt-1">6 matcher kvar att spela denna säsong</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* League Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Tabellställning
            </CardTitle>
            <CardDescription className="text-xs">
              Division 3 Norra - Aktuell ställning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">#</th>
                    <th className="text-left py-2 px-2">Lag</th>
                    <th className="text-center py-2 px-1">M</th>
                    <th className="text-center py-2 px-1">V</th>
                    <th className="text-center py-2 px-1">O</th>
                    <th className="text-center py-2 px-1">F</th>
                    <th className="text-center py-2 px-1">GM</th>
                    <th className="text-center py-2 px-1">IM</th>
                    <th className="text-center py-2 px-1">MS</th>
                    <th className="text-center py-2 px-1 font-bold">P</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">1</td>
                    <td className="py-2 px-2">Frösö IF</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">7</td>
                    <td className="text-center py-2 px-1">0</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">28</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">+20</td>
                    <td className="text-center py-2 px-1 font-bold">21</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50 bg-primary/5">
                    <td className="py-2 px-2 font-bold">2</td>
                    <td className="py-2 px-2 font-bold">Vårt lag</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">5</td>
                    <td className="text-center py-2 px-1">2</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">22</td>
                    <td className="text-center py-2 px-1">12</td>
                    <td className="text-center py-2 px-1">+10</td>
                    <td className="text-center py-2 px-1 font-bold">17</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">3</td>
                    <td className="py-2 px-2">Brunflo IK</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">4</td>
                    <td className="text-center py-2 px-1">3</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">18</td>
                    <td className="text-center py-2 px-1">10</td>
                    <td className="text-center py-2 px-1">+8</td>
                    <td className="text-center py-2 px-1 font-bold">15</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">4</td>
                    <td className="py-2 px-2">Östersund FK</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">3</td>
                    <td className="text-center py-2 px-1">2</td>
                    <td className="text-center py-2 px-1">3</td>
                    <td className="text-center py-2 px-1">15</td>
                    <td className="text-center py-2 px-1">15</td>
                    <td className="text-center py-2 px-1">0</td>
                    <td className="text-center py-2 px-1 font-bold">11</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">5</td>
                    <td className="py-2 px-2">Lit IF</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">2</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">5</td>
                    <td className="text-center py-2 px-1">10</td>
                    <td className="text-center py-2 px-1">20</td>
                    <td className="text-center py-2 px-1">-10</td>
                    <td className="text-center py-2 px-1 font-bold">7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Latest Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Senaste resultat
            </CardTitle>
            <CardDescription className="text-xs">
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

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Spelare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18</div>
              <p className="text-xs text-muted-foreground mt-1">Aktiva spelare</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Närvaro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87%</div>
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
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Denna månad</p>
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
              <p className="text-xs text-muted-foreground mt-1">5V, 2O, 1F</p>
            </CardContent>
          </Card>
        </div>

        {/* Training Focus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Fokusområden senaste 3 månaderna
            </CardTitle>
            <CardDescription className="text-xs">
              Fördelning av träningsinnehåll
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Teknik & Bollkontroll</span>
                  <span className="text-sm text-muted-foreground">35%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "35%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Passning & Mottagning</span>
                  <span className="text-sm text-muted-foreground">28%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "28%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Avslut & Skott</span>
                  <span className="text-sm text-muted-foreground">22%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "22%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Taktik & Positionsspel</span>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "15%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CoachDashboard;
