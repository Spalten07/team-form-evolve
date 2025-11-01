import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

interface PastEvent {
  id: string;
  date: string;
  time: string;
  type: "training" | "match";
  title: string;
  location: string;
  attendance: "confirmed" | "absent";
  result?: string;
}

const PlayerPastActivities = () => {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch past activities from database
  useEffect(() => {
    if (!user) return;

    const fetchPastActivities = async () => {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .lt('end_time', now)
          .order('start_time', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const formattedEvents: PastEvent[] = data.map(activity => {
            const startDate = parseISO(activity.start_time);
            
            // Extract location from description
            const locationMatch = activity.description?.match(/Plats:\s*(.+?)(?:\n|$)/);
            const location = locationMatch ? locationMatch[1] : "Plats ej angiven";
            
            return {
              id: activity.id,
              date: format(startDate, 'yyyy-MM-dd'),
              time: format(startDate, 'HH:mm'),
              type: activity.activity_type === 'match' ? 'match' : 'training',
              title: activity.title,
              location: location,
              attendance: "confirmed"
            };
          });
          setEvents(formattedEvents);
        }
      } catch (error: any) {
        console.error('Error fetching past activities:', error);
        toast.error("Kunde inte hämta tidigare aktiviteter");
      }
    };

    fetchPastActivities();
  }, [user]);

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

  const getAttendanceBadge = (attendance: string) => {
    switch (attendance) {
      case "confirmed":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Närvarande</Badge>;
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
          <Button 
            variant="ghost" 
            onClick={() => navigate("/player-calendar")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kommande aktiviteter
          </Button>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Tidigare aktiviteter
          </h1>
          <p className="text-muted-foreground text-lg">
            Se dina tidigare träningar och matcher med laget
          </p>
        </div>

        {/* Stats Overview */}
        <Card className="mb-8 bg-gradient-primary text-primary-foreground border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Statistik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">
                  {events.filter(e => e.attendance === "confirmed").length}
                </div>
                <div className="text-sm opacity-90">Genomförda aktiviteter</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">
                  {Math.round((events.filter(e => e.attendance === "confirmed").length / events.length) * 100)}%
                </div>
                <div className="text-sm opacity-90">Närvaro</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">
                  {events.filter(e => e.type === "match").length}
                </div>
                <div className="text-sm opacity-90">Matcher</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Historik</h2>
          
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {getTypeBadge(event.type)}
                      {getAttendanceBadge(event.attendance)}
                      {event.result && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {event.result}
                        </Badge>
                      )}
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

export default PlayerPastActivities;
