import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, History } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TeamEvent {
  id: number;
  date: string;
  time: string;
  type: "training" | "match";
  title: string;
  location: string;
  attendance?: "confirmed" | "pending" | "absent";
}

const mockEvents: TeamEvent[] = [
  {
    id: 1,
    date: "2025-11-01",
    time: "18:00",
    type: "training",
    title: "Lagträning - Passningar",
    location: "Fotbollsplan 1",
    attendance: "confirmed"
  },
  {
    id: 2,
    date: "2025-11-03",
    time: "15:00",
    type: "match",
    title: "Seriematch mot Hammarby IF",
    location: "Tele2 Arena",
    attendance: "confirmed"
  },
  {
    id: 3,
    date: "2025-11-05",
    time: "18:00",
    type: "training",
    title: "Lagträning - Avslut",
    location: "Fotbollsplan 1",
    attendance: "pending"
  },
  {
    id: 4,
    date: "2025-11-08",
    time: "18:00",
    type: "training",
    title: "Lagträning - Taktik",
    location: "Fotbollsplan 2",
    attendance: "pending"
  }
];

const PlayerCalendar = () => {
  const [events] = useState<TeamEvent[]>(mockEvents);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getTypeBadge = (type: string) => {
    if (type === "match") {
      return <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Match</Badge>;
    }
    return <Badge variant="outline">Träning</Badge>;
  };

  const getAttendanceBadge = (attendance?: string) => {
    switch (attendance) {
      case "confirmed":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Bekräftad</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Väntande</Badge>;
      case "absent":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Frånvarande</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Lagets kalender
            </h1>
            <p className="text-muted-foreground text-lg">
              Se kommande träningar och matcher med laget
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/player-past-activities")}
          >
            <History className="w-4 h-4" />
            Tidigare aktiviteter
          </Button>
        </div>

        {/* Calendar Overview */}
        <Card className="mb-8 bg-gradient-primary text-primary-foreground border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              November 2025
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Översikt över dina kommande aktiviteter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">
                  {events.filter(e => e.type === "training").length}
                </div>
                <div className="text-sm opacity-90">Träningar</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">
                  {events.filter(e => e.type === "match").length}
                </div>
                <div className="text-sm opacity-90">Matcher</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">
                  {events.filter(e => e.attendance === "confirmed").length}
                </div>
                <div className="text-sm opacity-90">Bekräftade</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List - Komprimerad vy */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Kommande aktiviteter</h2>
          
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-3 min-w-[60px]">
                      <div className="text-2xl font-bold text-primary">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('sv-SE', { month: 'short' })}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {getTypeBadge(event.type)}
                        {getAttendanceBadge(event.attendance)}
                      </div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
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

export default PlayerCalendar;
