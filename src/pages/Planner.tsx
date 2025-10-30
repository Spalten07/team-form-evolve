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
          <Button variant="hero" size="lg" className="gap-2" asChild>
            <Link to="/create-training">
              <Plus className="w-5 h-5" />
              Ny träning
            </Link>
          </Button>
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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Planerade träningar</h2>
              
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(session.status)}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(session.date)}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-1">{session.title}</CardTitle>
                    <CardDescription>{session.focus}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {session.time} - {session.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {session.players} spelare
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    {session.focus}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="default" className="flex-1">
                    Visa detaljer
                  </Button>
                  <Button variant="outline">
                    Redigera
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-6 h-6" />
                  Lagets kalender
                </CardTitle>
                <CardDescription>
                  Här kommer du kunna synka matcher och träningar med lagets kalender
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CalendarDays className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg mb-4">Kalenderfunktion kommer snart</p>
                  <p className="text-sm text-muted-foreground">
                    Du kommer kunna synka matcher, träningar och evenemang i en gemensam kalender för laget
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Schemalägg kallelser
                </CardTitle>
                <CardDescription>
                  Planera och schemalägg träningskallelser och matchkallelser i förväg
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg mb-4">Schemaläggningsfunktion kommer snart</p>
                  <p className="text-sm text-muted-foreground">
                    Du kommer kunna schemalägga och automatiskt skicka kallelser till träningar och matcher
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Planner;
