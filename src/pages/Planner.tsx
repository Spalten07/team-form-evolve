import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Users, Target, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface TrainingSession {
  id: number;
  date: string;
  time: string;
  title: string;
  focus: string;
  duration: string;
  players: number;
  status: "planned" | "completed" | "upcoming";
}

const mockSessions: TrainingSession[] = [
  {
    id: 1,
    date: "2025-11-01",
    time: "18:00",
    title: "Passningsfokus",
    focus: "Teknik & Passning",
    duration: "90 min",
    players: 16,
    status: "completed"
  },
  {
    id: 2,
    date: "2025-11-03",
    time: "18:00",
    title: "Taktisk träning",
    focus: "Positionsspel",
    duration: "90 min",
    players: 18,
    status: "upcoming"
  },
  {
    id: 3,
    date: "2025-11-05",
    time: "18:00",
    title: "Match & Avslut",
    focus: "Avslut & Spelformer",
    duration: "90 min",
    players: 20,
    status: "planned"
  }
];

const Planner = () => {
  const [sessions] = useState<TrainingSession[]>(mockSessions);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Genomförd</Badge>;
      case "upcoming":
        return <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Kommande</Badge>;
      case "planned":
        return <Badge variant="outline">Planerad</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Träningsplanering
            </h1>
            <p className="text-muted-foreground text-lg">
              Planera och organisera dina träningar
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="hero" size="lg" className="gap-2" asChild>
              <Link to="/create-training">
                <Plus className="w-5 h-5" />
                Ny träning
              </Link>
            </Button>
            <Button variant="default" size="lg" className="gap-2" asChild>
              <Link to="/send-callup">
                <Users className="w-5 h-5" />
                Skicka kallelse
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link to="/saved-trainings">
                <Target className="w-5 h-5" />
                Mina träningspass
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="trainings" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8">
            <TabsTrigger value="trainings">Träningar</TabsTrigger>
            <TabsTrigger value="calendar">Lagets kalender</TabsTrigger>
            <TabsTrigger value="scheduling">Schemaläggning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trainings">
            {/* Calendar View Card */}
            <Card className="mb-8 bg-gradient-primary text-primary-foreground border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  November 2025
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Översikt över planerade träningar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold">8</div>
                    <div className="text-sm opacity-90">Träningar denna månad</div>
                  </div>
                  <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold">3</div>
                    <div className="text-sm opacity-90">Kommande träningar</div>
                  </div>
                  <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold">18</div>
                    <div className="text-sm opacity-90">Genomsnittligt antal spelare</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training Sessions List */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Planerade träningar</h2>
              
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-all">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(session.status)}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(session.date)} • {session.time}
                      </span>
                    </div>
                    <CardTitle className="text-base">{session.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Detaljer</Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-6 h-6" />
                      Lagets kalender
                    </CardTitle>
                    <CardDescription>Veckoschema för träningar och matcher</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">← Föregående vecka</Button>
                    <Button variant="outline" size="sm">Denna vecka</Button>
                    <Button variant="outline" size="sm">Nästa vecka →</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-8 bg-secondary">
                    <div className="p-2 text-xs font-semibold border-r">Tid</div>
                    <div className="p-2 text-xs font-semibold border-r text-center">Mån</div>
                    <div className="p-2 text-xs font-semibold border-r text-center">Tis</div>
                    <div className="p-2 text-xs font-semibold border-r text-center">Ons</div>
                    <div className="p-2 text-xs font-semibold border-r text-center">Tor</div>
                    <div className="p-2 text-xs font-semibold border-r text-center">Fre</div>
                    <div className="p-2 text-xs font-semibold border-r text-center">Lör</div>
                    <div className="p-2 text-xs font-semibold text-center">Sön</div>
                  </div>
                  
                  {["16:00", "17:00", "18:00", "19:00"].map((time) => (
                    <div key={time} className="grid grid-cols-8 border-t">
                      <div className="p-2 text-xs text-muted-foreground border-r bg-secondary/50">{time}</div>
                      <div className="p-1 border-r"></div>
                      <div className="p-1 border-r">
                        {time === "18:00" && (
                          <div className="bg-primary/10 border border-primary/20 rounded p-1">
                            <p className="text-xs font-medium text-primary">Träning</p>
                          </div>
                        )}
                      </div>
                      <div className="p-1 border-r"></div>
                      <div className="p-1 border-r">
                        {time === "18:00" && (
                          <div className="bg-primary/10 border border-primary/20 rounded p-1">
                            <p className="text-xs font-medium text-primary">Träning</p>
                          </div>
                        )}
                      </div>
                      <div className="p-1 border-r"></div>
                      <div className="p-1 border-r">
                        {time === "17:00" && (
                          <div className="bg-accent/10 border border-accent/20 rounded p-1">
                            <p className="text-xs font-medium text-accent">Match</p>
                          </div>
                        )}
                      </div>
                      <div className="p-1"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Schemalagda kallelser
                </CardTitle>
                <CardDescription>
                  Automatiska kallelser som skickas i förväg
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Scheduled Callup 1 */}
                <Card className="border-primary/20">
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">Träningskallelse - Tisdagar</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Skickas 2 dagar innan • Till: Alla spelare (8)
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Scheduled Callup 2 */}
                <Card className="border-primary/20">
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">Matchkallelse - Lördagar</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Skickas 3 dagar innan • Till: Alla spelare (8)
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Scheduled Callup 3 */}
                <Card className="border-primary/20">
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">Träningskallelse - Torsdagar</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Skickas 1 dag innan • Till: Alla spelare (8)
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                  </CardHeader>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Planner;
