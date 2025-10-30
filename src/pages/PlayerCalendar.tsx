import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Lagets kalender
          </h1>
          <p className="text-muted-foreground text-lg">
            Se kommande träningar och matcher med laget
          </p>
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

        {/* Events List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Kommande aktiviteter</h2>
          
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeBadge(event.type)}
                      {getAttendanceBadge(event.attendance)}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
                    <CardDescription>{event.location}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Lagaktivitet
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
