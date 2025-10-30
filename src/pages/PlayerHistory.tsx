import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, PieChart } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TrainingSession {
  id: number;
  date: string;
  duration: number;
  focus: string;
  exercises: number;
  completed: boolean;
}

const mockSessions: TrainingSession[] = [
  {
    id: 1,
    date: "2025-10-28",
    duration: 45,
    focus: "Teknik & Ballkontroll",
    exercises: 4,
    completed: true
  },
  {
    id: 2,
    date: "2025-10-25",
    duration: 30,
    focus: "Passningar",
    exercises: 3,
    completed: true
  },
  {
    id: 3,
    date: "2025-10-22",
    duration: 60,
    focus: "Avslut",
    exercises: 5,
    completed: true
  }
];

const PlayerHistory = () => {
  const [sessions] = useState<TrainingSession[]>(mockSessions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Min träningshistorik
          </h1>
          <p className="text-muted-foreground text-lg">
            Här kan du se dina tidigare träningspass och statistik
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{totalSessions}</CardTitle>
              <CardDescription>Genomförda träningar</CardDescription>
            </CardHeader>
          </Card>
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {totalHours}h {remainingMinutes}min
                    <PieChart className="w-5 h-5 text-primary" />
                  </CardTitle>
                  <CardDescription>Total träningstid (klicka för detaljer)</CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Träningsstatistik</DialogTitle>
                <DialogDescription>
                  Fördelning av dina träningsfokus
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <div className="w-64 h-64 mx-auto mb-6 relative">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="20" strokeDasharray="75 25" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--accent))" strokeWidth="20" strokeDasharray="15 85" strokeDashoffset="-75" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--secondary))" strokeWidth="20" strokeDasharray="10 90" strokeDashoffset="-90" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{totalHours}h</div>
                      <div className="text-sm text-muted-foreground">{remainingMinutes}min</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                    <span className="font-medium">Teknik & Ballkontroll</span>
                    <span className="text-sm">75% ({Math.round(totalMinutes * 0.75)} min)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <span className="font-medium">Passningar</span>
                    <span className="text-sm">15% ({Math.round(totalMinutes * 0.15)} min)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10">
                    <span className="font-medium">Avslut</span>
                    <span className="text-sm">10% ({Math.round(totalMinutes * 0.10)} min)</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {sessions.reduce((sum, s) => sum + s.exercises, 0)}
              </CardTitle>
              <CardDescription>Övningar genomförda</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Training Sessions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Träningshistorik</h2>
          
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-success/10 text-success hover:bg-success/20">
                        Genomförd
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(session.date)}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-1">{session.focus}</CardTitle>
                    <CardDescription>
                      {session.exercises} övningar genomförda
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {session.duration} minuter
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    {session.focus}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(session.date)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PlayerHistory;
