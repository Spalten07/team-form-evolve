import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, PieChart, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TrainingSession {
  id: string;
  date: string;
  duration: number;
  title: string;
  type: string;
  completed: boolean;
  description?: string;
}

const PlayerHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchCompletedActivities = async () => {
      try {
        // Get player's team_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('team_id')
          .eq('id', user.id)
          .single();

        if (!profile?.team_id) return;

        // Fetch activities where end_time has passed
        const { data: activities, error } = await supabase
          .from('activities')
          .select('*')
          .eq('team_id', profile.team_id)
          .lt('end_time', new Date().toISOString())
          .order('end_time', { ascending: false });

        if (error) throw error;

        if (activities) {
          const formattedSessions: TrainingSession[] = activities.map(activity => {
            const start = new Date(activity.start_time);
            const end = new Date(activity.end_time);
            const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

            return {
              id: activity.id,
              date: activity.start_time,
              duration,
              title: activity.title,
              type: activity.activity_type,
              completed: true,
              description: activity.description
            };
          });

          setSessions(formattedSessions);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Kunde inte hämta träningshistorik');
      }
    };

    fetchCompletedActivities();
  }, [user]);

  const toggleSession = (sessionId: string) => {
    setExpandedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{totalSessions}</CardTitle>
              <CardDescription>Genomförda aktiviteter</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {totalHours}h {remainingMinutes}min
              </CardTitle>
              <CardDescription>Total träningstid</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Training Sessions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Träningshistorik</h2>
          
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Inga genomförda aktiviteter ännu</p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Collapsible 
                key={session.id}
                open={expandedSessions.includes(session.id)}
                onOpenChange={() => toggleSession(session.id)}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={session.type === 'match' ? 'default' : 'secondary'}>
                              {session.type === 'match' ? 'Match' : 'Träning'}
                            </Badge>
                            <Badge className="bg-success/10 text-success hover:bg-success/20">
                              Genomförd
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(session.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">{session.title}</CardTitle>
                            {expandedSessions.includes(session.id) ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {session.duration} minuter
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(session.date)}
                      </div>
                    </div>
                    
                    <CollapsibleContent>
                      {session.description && (
                        <div className="mt-4 space-y-2 border-t pt-4">
                          <h4 className="font-semibold text-sm mb-3">Beskrivning:</h4>
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default PlayerHistory;
